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
import SentenceAnalysis from "./SentenceAnalysis";
import { CHOICES } from "./utils";

const TabPane = Tabs.TabPane;

function Dashboard() {
  const [step, setStep] = useState({ step: 0 });

  const [mode, setMode] = useState(0);

  const [query, setQuery] = useState("");

  const [detectionResults, setDetectionResults] = useState({});

  const [searchResultsGoogle, setSearchResultsGoogle] = useState({});

  const [queryResultsGoogle, setQueryResultsGoogle] = useState({});

  const [imageResultsGoogle, setImageResultsGoogle] = useState({});

  const [reverseResultsGoogle, setReverseResultsGoogle] = useState({});

  const [fetchingGoogle, setFetchingGoogle] = useState(false);

  const [fetchingQuery, setFetchingQuery] = useState(false);

  const [fetchingImagesGoogle, setFetchingImagesGoogle] = useState(false);

  const [fetchingReverse, setFetchingReverse] = useState(false);

  useEffect(() => {
    switch (step.step) {
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
        if (query) {
          query_search();
        }
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
    setStep({ step: 1 });
  };

  const startReverseSearch = () => {
    reset();
    setMode(1);
    setStep({ step: 4 });
  };

  const reset = () => {
    setQuery("");
    setSearchResultsGoogle({});
    setQueryResultsGoogle({});
    setReverseResultsGoogle({});
    setImageResultsGoogle({});
    setDetectionResults({});
  };

  const capture = nextStep => {
    api.get(config.endpoint + "screen-shot").then(response => {
      if (response.successful) {
        setStep({ step: nextStep, data: response.data });
      } else {
        message.error("Failed to take screenshot");
        setStep({ step: 0 });
      }
    });
  };

  const detect = () => {
    api.post(config.endpoint + "ocr", { start: step.data }).then(response => {
      if (response.successful) {
        setDetectionResults(response.data);
        setStep({ step: 3 });
      } else {
        message.error("Failed to detect text");
        setStep({ step: 0 });
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
        setStep({ step: 0 });
        setImageResultsGoogle(values.data);
      })
      .catch(ignored => {
        setFetchingImagesGoogle(false);
        setStep({ step: 0 });
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
    Promise.all([CHOICES.A, CHOICES.B, CHOICES.C].map(getSearchPromise))
      .then(values => {
        setFetchingGoogle(false);
        setStep({ step: 0 });
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
        setStep({ step: 0 });
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
        setStep({ step: 0 });
      })
      .catch(ignored => {
        message.error("Failed to image search");
        setFetchingReverse(false);
        setStep({ step: 0 });
      });
  };

  const query_search = () => {
    const getSearchPromise = choice => {
      return api.post(config.endpoint + "query", getRequestData(choice));
    };

    const getRequestData = choice => {
      return {
        query,
        choice: detectionResults.choices[choice]
      };
    };

    setFetchingQuery(true);
    Promise.all([CHOICES.A, CHOICES.B, CHOICES.C].map(getSearchPromise))
      .then(values => {
        setFetchingQuery(false);
        const results = values.map(v => v.data.result);
        const texts = values.map(v => v.data.texts);
        const useds = values.map(v => v.data.used);
        setQueryResultsGoogle({
          a: { count: results[0], text: texts[0], used: useds[0] },
          b: { count: results[1], text: texts[1], used: useds[1] },
          c: { count: results[2], text: texts[2], used: useds[2] }
        });
      })
      .catch(ignored => {
        setFetchingQuery(false);
        setStep({ step: 0 });
        message.error("Failed to query search");
      });
  };

  return (
    <div>
      <Row>
        <Col span={4}>
          <History
            onStartSearch={startSearch}
            onStartReverseSearch={startReverseSearch}
            query={query}
            setQuery={setQuery}
            spinning={step.step !== 0}
          />
        </Col>
        <Col span={14} offset={1}>
          <Prediction
            results={searchResultsGoogle}
            detection={detectionResults}
          />
        </Col>
        <Col span={4} offset={1}>
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
                  <div>
                    <Occurrence
                      detection={detectionResults}
                      results={searchResultsGoogle}
                      imageResults={imageResultsGoogle}
                      fetching={fetchingGoogle}
                      fetchingImages={fetchingImagesGoogle}
                    />
                    {query && (
                      <Occurrence
                        detection={detectionResults}
                        results={queryResultsGoogle}
                        imageResults={{}}
                        fetching={fetchingQuery}
                      />
                    )}
                  </div>
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
                <SentenceAnalysis detectionResults={detectionResults} />
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
