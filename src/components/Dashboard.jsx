import React, { useState, useEffect } from "react";
import History from "./History";
import { api } from "../helpers/api";
import * as config from "../config/client";
import { EVENTS, SEARCH_ENGINES } from "./constants";

import GOOGLE_LOGO from "../assets/images/google_logo.png";
import YANDEX_LOGO from "../assets/images/yandex_logo.png";
import RANDOM_LOGO from "../assets/images/random_logo.jpg";
import YAHOO_LOGO from "../assets/images/yahoo_logo.png";

import "../assets/styles/style";
import { Card, Col, Row, message } from "antd";
import Question from "./Question";
import Stats from "./Stats";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function Dashboard() {
  const [timeLine, setTimeLine] = useState([]);
  const [step, setStep] = useState(0);

  const [detectionResults, setDetectionResults] = useState({});

  const [searchResultsGoogle, setSearchResultsGoogle] = useState({});
  const [searchResultsYahoo, setSearchResultsYahoo] = useState({});
  const [searchResultsYandex, setSearchResultsYandex] = useState({});
  const [fetchingGoogle, setFetchingGoogle] = useState(false);
  const [fetchingYahoo, setFetchingYahoo] = useState(false);
  const [fetchingYandex, setFetchingYandex] = useState(false);

  const start = () => {
    setTimeLine([EVENTS.STARTED]);
    setStep(1);
  };

  const reset = () => {
    setDetectionResults({});
    setSearchResultsGoogle({});
    setSearchResultsYandex({});
    setSearchResultsYahoo({});
  };

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
        search(SEARCH_ENGINES.YANDEX);
        search(SEARCH_ENGINES.YAHOO);
        break;
      default:
        break;
    }
  }, [step]);

  const capture = () => {
    setTimeLine([...timeLine, EVENTS.REQUEST_CAPTURE]);
    api.get(config.endpoint + "screen-shot").then(response => {
      if (response.successful) {
        setTimeLine([...timeLine, EVENTS.CAPTURE_SUCCESS]);
        setStep(2);
      } else {
        setTimeLine([...timeLine, EVENTS.CAPTURE_ERROR, EVENTS.READY_FOR_NEXT]);
        setStep(0);
      }
    });
  };

  const detect = () => {
    setTimeLine([...timeLine, EVENTS.REQUEST_DETECTION]);
    api.get(config.endpoint + "ocr").then(response => {
      if (response.successful) {
        setTimeLine([...timeLine, EVENTS.DETECTION_SUCCESS]);
        setDetectionResults(response.data);
        setStep(3);
      } else {
        setTimeLine([
          ...timeLine,
          EVENTS.DETECTION_ERROR,
          EVENTS.READY_FOR_NEXT
        ]);
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
        engine,
        nlp: detectionResults.nlp
      };
    }

    function setFetching(fetching) {
      switch (engine) {
        case SEARCH_ENGINES.GOOGLE:
          setFetchingGoogle(fetching);
          break;
        case SEARCH_ENGINES.YAHOO:
          setFetchingYahoo(fetching);
          break;
        case SEARCH_ENGINES.YANDEX:
          setFetchingYandex(fetching);
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
        case SEARCH_ENGINES.YAHOO:
          setSearchResultsYahoo(data);
          break;
        case SEARCH_ENGINES.YANDEX:
          setSearchResultsYandex(data);
          break;
        default:
          break;
      }
    }

    setFetching(true);
    Promise.all(["a", "b", "c"].map(getSearchPromise))
      .then(values => {
        setFetching(false);
        const results = values.map(v => v.data.result);
        setSearchResults({
          a: results[0],
          b: results[1],
          c: results[2]
        });
      })
      .catch(ignored => {
        setFetching(false);
        message.error("An error occurred while searching " + engine);
      });
  };

  return (
    <Card title="Dashboard">
      <Row>
        <Col span={5}>
          <History events={timeLine} onStart={start} />
        </Col>
        <Col span={19}>
          <Card title="Search Results">
            <Row>
              <Col span={8}>
                <Question detection={detectionResults} />
              </Col>
              <Col span={15} offset={1}>
                <Row>
                  <Col span={11}>
                    <Stats
                      results={searchResultsGoogle}
                      src={GOOGLE_LOGO}
                      fetching={fetchingGoogle}
                    />
                  </Col>
                  <Col span={11} offset={1}>
                    <Stats
                      results={searchResultsYandex}
                      src={YANDEX_LOGO}
                      fetching={fetchingYandex}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                    <Stats
                      results={searchResultsYahoo}
                      src={YAHOO_LOGO}
                      fetching={fetchingYahoo}
                    />
                  </Col>
                  <Col span={11} offset={1}>
                    <Stats
                      results={{
                        a: getRandomInt(100),
                        b: getRandomInt(100),
                        c: getRandomInt(100)
                      }}
                      src={RANDOM_LOGO}
                      fetching={false}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

export default Dashboard;
