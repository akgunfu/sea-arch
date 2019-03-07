import React, { useState, useEffect } from "react";
import History from "./History";
import { api } from "../helpers/api";
import * as config from "../config/client";

import GOOGLE_LOGO from "../assets/images/google_logo.png";

import "../assets/styles/style";
import { Card, Col, Row, message, Spin } from "antd";
import Question from "./Question";
import Stats from "./Stats";
import Occurrence from "./Occurrence";
import ReverseResults from "./ReverseResults";

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
        reset();
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
    setMode(0);
    setStep(1);
  };

  const startReverseSearch = () => {
    setMode(1);
    setStep(4);
  };

  const reset = () => {};

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
    <Row>
      <Col span={4}>
        <Row>
          <History
            onStartSearch={startSearch}
            onStartReverseSearch={startReverseSearch}
            spinning={step !== 0}
          />
        </Row>
        <Row>
          <Question detection={detectionResults} />
        </Row>
        <Row>
          <Stats
            results={searchResultsGoogle}
            src={GOOGLE_LOGO}
            fetching={fetchingGoogle}
          />
        </Row>
        <Row>
          <Spin spinning={fetchingImagesGoogle}>
            {(imageResultsGoogle.result || [])
              .filter(img => img["keyword-index"] === 0)
              .map(imRes => {
                return <img className="result-image" src={imRes.url} alt={0} />;
              })}
          </Spin>
        </Row>
      </Col>
      <Col span={20}>
        <Card title="Search Results">
          {mode === 0 && (
            <Row>
              <Col span={24}>
                <Occurrence
                  detection={detectionResults}
                  results={searchResultsGoogle}
                  imageResults={imageResultsGoogle}
                  fetching={fetchingGoogle}
                  fetchingImages={fetchingImagesGoogle}
                />
              </Col>
            </Row>
          )}
          {mode === 1 && (
            <Row>
              <Col span={24}>
                <ReverseResults
                  results={reverseResultsGoogle}
                  fetching={fetchingReverse}
                />
              </Col>
            </Row>
          )}
        </Card>
      </Col>
    </Row>
  );
}

export default Dashboard;
