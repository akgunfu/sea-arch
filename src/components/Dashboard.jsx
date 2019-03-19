import React, { useState, useEffect } from "react";
import History from "./History";
import { api } from "../helpers/api";
import * as config from "../config/client";

import "../assets/styles/style";
import { Card, Col, Row, message, Spin, Tabs, Icon } from "antd";
import Occurrence from "./Occurrence";
import ReverseResults from "./ReverseResults";
import Prediction from "./Prediction";
import Maps from "./Maps";

import FLAGS from "../assets/images/all_flags.jpg";
import ZODIACS from "../assets/images/zodiacs.png";

const TabPane = Tabs.TabPane;

function Dashboard() {
  const [step, setStep] = useState(0);

  const [mode, setMode] = useState(0);

  const [detectionResults, setDetectionResults] = useState({});

  const [searchResultsGoogle, setSearchResultsGoogle] = useState({});

  const [imageResultsGoogle, setImageResultsGoogle] = useState({});

  const [reverseResultsGoogle, setReverseResultsGoogle] = useState({});

  const [fetchingGoogle, setFetchingGoogle] = useState(false);

  const [fetchingImagesGoogle, setFetchingImagesGoogle] = useState(false);

  const [fetchingReverse, setFetchingReverse] = useState(false);

  useEffect(() => {
    switch (step) {
      case 0:
        break;
      case 1:
        capture(2);
        break;
      case 2:
        detect();
        break;
      case 3:
        search_images();
        search();
        break;
      case 4:
        capture(5);
        break;
      case 5:
        reverse_search();
        break;
      default:
        break;
    }
  }, [step]);

  const startSearch = () => {
    reset();
    setMode(0);
    setStep(1);
  };

  const startReverseSearch = () => {
    reset();
    setMode(1);
    setStep(4);
  };

  const reset = () => {
    setSearchResultsGoogle({});
    setReverseResultsGoogle({});
    setImageResultsGoogle({});
    setDetectionResults({});
  };

  const capture = nextStep => {
    api.get(config.endpoint + "screen-shot").then(response => {
      if (response.successful) {
        setStep(nextStep);
      } else {
        message.error("Failed to take screenshot");
        setStep(0);
      }
    });
  };

  const detect = () => {
    api.get(config.endpoint + "ocr").then(response => {
      if (response.successful) {
        setDetectionResults(response.data);
        setStep(3);
      } else {
        message.error("Failed to detect text");
        setStep(0);
      }
    });
  };

  const search_images = () => {
    setFetchingImagesGoogle(true);
    api
      .post(config.endpoint + "search-images", {
        question: detectionResults.question,
        choices: detectionResults.choices,
        nlp: detectionResults.nlp
      })
      .then(values => {
        setFetchingImagesGoogle(false);
        setStep(0);
        setImageResultsGoogle(values.data);
      })
      .catch(ignored => {
        setFetchingImagesGoogle(false);
        setStep(0);
        message.error("Failed to image search");
      });
  };

  const search = () => {
    const getSearchPromise = choice => {
      return api.post(config.endpoint + "search", getRequestData(choice));
    };

    const getRequestData = choice => {
      return {
        question: detectionResults.question,
        choice: detectionResults.choices[choice],
        choices: detectionResults.choices,
        nlp: detectionResults.nlp
      };
    };

    setFetchingGoogle(true);
    Promise.all(["a", "b", "c"].map(getSearchPromise))
      .then(values => {
        setFetchingGoogle(false);
        setStep(0);
        const results = values.map(v => v.data.result);
        const texts = values.map(v => v.data.texts);
        const useds = values.map(v => v.data.used);
        setSearchResultsGoogle({
          a: { count: results[0], text: texts[0], used: useds[0] },
          b: { count: results[1], text: texts[1], used: useds[1] },
          c: { count: results[2], text: texts[2], used: useds[2] }
        });
      })
      .catch(ignored => {
        setFetchingGoogle(false);
        setStep(0);
        message.error("Failed to search");
      });
  };

  const reverse_search = () => {
    setFetchingReverse(true);
    api
      .get(config.endpoint + "reverse-image-search")
      .then(values => {
        setReverseResultsGoogle(values.data.result);
        setFetchingReverse(false);
        setStep(0);
      })
      .catch(ignored => {
        message.error("Failed to image search");
        setFetchingReverse(false);
        setStep(0);
      });
  };

  return (
    <div>
      <Row>
        <Col span={4}>
          <History
            onStartSearch={startSearch}
            onStartReverseSearch={startReverseSearch}
            spinning={step !== 0}
          />
        </Col>
        <Col span={12} offset={2}>
          <Prediction
            results={searchResultsGoogle}
            detection={detectionResults}
          />
        </Col>
        <Col span={4} offset={2}>
          <Spin spinning={fetchingImagesGoogle}>
            {(imageResultsGoogle.result || [])
              .filter(img => img["keyword-index"] === 0)
              .map((imRes, i) => {
                return (
                  <img
                    className="result-image-main"
                    src={imRes.url}
                    alt={0}
                    key={i}
                  />
                );
              })}
          </Spin>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card>
            <Tabs type="card">
              <TabPane
                tab={
                  <span>
                    <Icon type="notification" />
                    Search Results
                  </span>
                }
                key="1"
              >
                {mode === 0 && (
                  <Occurrence
                    detection={detectionResults}
                    results={searchResultsGoogle}
                    imageResults={imageResultsGoogle}
                    fetching={fetchingGoogle}
                    fetchingImages={fetchingImagesGoogle}
                  />
                )}
                {mode === 1 && (
                  <ReverseResults
                    results={reverseResultsGoogle}
                    fetching={fetchingReverse}
                  />
                )}
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="read" />
                    Sentence Analysis
                  </span>
                }
                key="2"
              >
                <p>Coming soon...</p>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="pushpin" />
                    Maps
                  </span>
                }
                key="3"
              >
                <Maps />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="flag" />
                    Flags
                  </span>
                }
                key="4"
              >
                <img className="extra-image" src={FLAGS} alt="FLAGS" />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="deployment-unit" />
                    Zodiacs
                  </span>
                }
                key="5"
              >
                <img className="extra-image" src={ZODIACS} alt="ZODIACS" />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
