import React, { useState, useEffect } from "react";
import History from "./History";
import { api } from "../helpers/api";
import * as config from "../config/client";

import GOOGLE_LOGO from "../assets/images/google_logo.png";

import "../assets/styles/style";
import { Card, Col, Row, message } from "antd";
import Question from "./Question";
import Stats from "./Stats";
import Occurrence from "./Occurrence";

function Dashboard() {
  const [step, setStep] = useState(0);

  const [detectionResults, setDetectionResults] = useState({});

  const [searchResultsGoogle, setSearchResultsGoogle] = useState({});

  const [imageResultsGoogle, setImageResultsGoogle] = useState({});

  const [fetchingGoogle, setFetchingGoogle] = useState(false);

  const [fetchingImagesGoogle, setFetchingImagesGoogle] = useState(false);

  useEffect(() => {
    switch (step) {
      case 0:
        reset();
        break;
      case 1:
        capture();
        break;
      case 2:
        detect();
        break;
      case 3:
        search_images();
        search();
        break;
      default:
        break;
    }
  }, [step]);

  const start = () => {
    setStep(1);
  };

  const reset = () => {};

  const capture = () => {
    api.get(config.endpoint + "screen-shot").then(response => {
      if (response.successful) {
        setStep(2);
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
        message.error("Failed to search");
      });
  };

  return (
    <Row>
      <Col span={4}>
        <Row>
          <History onStart={start} spinning={step !== 0} />
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
          {(imageResultsGoogle.result || [])
            .filter(img => img["keyword-index"] === 0)
            .map(imRes => {
              return <img src={imRes.url} alt={0} width={200} height={200} />;
            })}
        </Row>
      </Col>
      <Col span={20}>
        <Card title="Search Results">
          <Row>
            <Col span={24}>
              <Occurrence
                detection={detectionResults}
                results={searchResultsGoogle}
                imageResults={imageResultsGoogle}
                fetching={fetchingGoogle}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}

export default Dashboard;
