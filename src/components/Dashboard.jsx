import React, { useState, useEffect } from "react";
import History from "./History";
import { api } from "../helpers/api";
import * as config from "../config/client";
import { SEARCH_ENGINES } from "./constants";

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

  const [fetchingGoogle, setFetchingGoogle] = useState(false);

  const start = () => {
    setStep(1);
  };

  const reset = () => {};

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
        search(SEARCH_ENGINES.GOOGLE);
        break;
      default:
        break;
    }
  }, [step]);

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

  const search = engine => {
    function getSearchPromise(choice) {
      return api.post(config.endpoint + "search", getRequestData(choice));
    }

    function getRequestData(choice) {
      return {
        question: detectionResults.question,
        choice: detectionResults.choices[choice],
        nlp: detectionResults.nlp
      };
    }

    function setFetching(fetching) {
      switch (engine) {
        case SEARCH_ENGINES.GOOGLE:
          setFetchingGoogle(fetching);
          break;
        default:
          break;
      }
    }

    function setSearchResults(data) {
      switch (engine) {
        case SEARCH_ENGINES.GOOGLE:
          setSearchResultsGoogle(data);
          break;
        default:
          break;
      }
    }

    setFetching(true);
    Promise.all(["a", "b", "c"].map(getSearchPromise))
      .then(values => {
        setFetching(false);
        setStep(0);
        const results = values.map(v => v.data.result);
        const texts = values.map(v => v.data.texts);
        const useds = values.map(v => v.data.used);
        setSearchResults({
          a: { count: results[0], text: texts[0], used: useds[0]},
          b: { count: results[1], text: texts[1], used: useds[1] },
          c: { count: results[2], text: texts[2], used: useds[2] }
        });
      })
      .catch(ignored => {
        setFetching(false);
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
      </Col>
      <Col span={20}>
        <Card title="Search Results">
          <Row>
            <Col span={24}>
              <Row>
                <Col>
                  <Occurrence
                    detection={detectionResults}
                    results={searchResultsGoogle}
                    fetching={fetchingGoogle}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}

export default Dashboard;
