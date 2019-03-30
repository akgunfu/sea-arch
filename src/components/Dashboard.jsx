import React, { useState, useEffect } from "react";
import { api } from "../helpers/api";
import * as config from "../config/client";

import "../assets/styles/style";
import { Card, Col, Row, message, Tabs, Icon } from "antd";
import Occurrence from "./Occurrence";
import ReverseResults from "./ReverseResults";
import Maps from "./infografic/Maps";
import SentenceAnalysis from "./SentenceAnalysis";
import { CHOICES } from "./utils";
import Space from "./infografic/Space";
import KeywordModal from "./KeywordModal";
import Zodiacs from "./infografic/Zodiacs";
import Ottomans from "./infografic/Ottomans";
import Flags from "./infografic/Flags";
import Header from "./Header";

const TabPane = Tabs.TabPane;

export const SEARCH_MODES = {
  AUTO_SEARCH: { id: 0, name: "Text Search" },
  REVERSE_IMAGE_SEARCH: { id: 1, name: "Image Search" },
  KEYWORD_SEARCH: { id: 2, name: "Keyword Search" },
  SENTENCE_ANALYSIS: { id: 3, name: "Word Analysis" }
};

function Dashboard() {
  const [step, setStep] = useState({ step: 0 });
  const [mode, setMode] = useState(SEARCH_MODES.AUTO_SEARCH.id);
  const [replayable, setReplayable] = useState(false);
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
  const [keywordModalVisible, setKeywordModalVisible] = useState(false);

  useEffect(() => {
    if (mode === SEARCH_MODES.AUTO_SEARCH.id) {
      switch (step.step) {
        case 0:
          break;
        case 1:
          capture();
          break;
        case 2:
          detect(true, 3);
          break;
        case 3:
          setReplayable(true);
          search_images();
          search();
          break;
        default:
          break;
      }
    }

    if (mode === SEARCH_MODES.REVERSE_IMAGE_SEARCH.id) {
      switch (step.step) {
        case 0:
          break;
        case 1:
          capture();
          break;
        case 2:
          setReplayable(true);
          reverse_search();
          break;
        default:
          break;
      }
    }

    if (mode === SEARCH_MODES.KEYWORD_SEARCH.id) {
      switch (step.step) {
        case 0:
          break;
        case 1:
          setKeywordModalVisible(true);
          capture();
          break;
        case 2:
          detect(false, 3);
          break;
        case 3:
          break;
        case 4:
          setReplayable(true);
          query_search();
          break;
        default:
          break;
      }
    }

    if (mode === SEARCH_MODES.SENTENCE_ANALYSIS.id) {
      switch (step.step) {
        case 0:
          break;
        case 1:
          capture();
          break;
        case 2:
          setReplayable(true);
          detect(true, 0);
          break;
      }
    }
  }, [step]);

  const replay = () => {
    if (mode === SEARCH_MODES.AUTO_SEARCH.id) {
      setStep({ step: 3, data: step.data });
    } else if (mode === SEARCH_MODES.REVERSE_IMAGE_SEARCH.id) {
      setStep({ step: 2, data: step.data });
    } else if (mode === SEARCH_MODES.KEYWORD_SEARCH.id) {
      setStep({ step: 3, data: step.data });
    } else if (mode === SEARCH_MODES.SENTENCE_ANALYSIS.id) {
      setStep({ step: 2, data: step.data });
    }
  };

  const startSearch = () => {
    reset();
    setMode(SEARCH_MODES.AUTO_SEARCH.id);
    setStep({ step: 1, data: step.data });
  };

  const startReverseSearch = () => {
    reset();
    setMode(SEARCH_MODES.REVERSE_IMAGE_SEARCH.id);
    setStep({ step: 1, data: step.data });
  };

  const startKeywordSearch = () => {
    reset();
    setMode(SEARCH_MODES.KEYWORD_SEARCH.id);
    setStep({ step: 1, data: step.data });
  };

  const continueKeywordSearch = () => {
    if (step.step === 3) {
      setStep({ step: 4, data: step.data });
      setKeywordModalVisible(false);
    }
  };

  const startSentenceAnalysis = () => {
    reset();
    setMode(SEARCH_MODES.SENTENCE_ANALYSIS.id);
    setStep({ step: 1, data: step.data });
  };

  const reset = () => {
    setSearchResultsGoogle({});
    setQueryResultsGoogle({});
    setReverseResultsGoogle({});
    setImageResultsGoogle({});
    setDetectionResults({});
  };

  const capture = () => {
    api.get(config.endpoint + "screen-shot").then(response => {
      if (response.successful) {
        setStep({ step: 2, data: response.data });
      } else {
        message.error("Failed to take screenshot");
        setStep({ step: 0, data: step.data });
      }
    });
  };

  const detect = (useNlp, nextStep) => {
    api
      .post(config.endpoint + "ocr", { start: step.data, nlp: useNlp })
      .then(response => {
        if (response.successful) {
          setDetectionResults(response.data);
          setStep({ step: nextStep, data: step.data });
        } else {
          message.error("Failed to detect text");
          setStep({ step: 0, data: step.data });
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
        setStep({ step: 0, data: step.data });
        setImageResultsGoogle(values.data);
      })
      .catch(ignored => {
        setFetchingImagesGoogle(false);
        setStep({ step: 0, data: step.data });
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
        setStep({ step: 0, data: step.data });
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
        setStep({ step: 0, data: step.data });
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
        setStep({ step: 0, data: step.data });
      })
      .catch(ignored => {
        message.error("Failed to image search");
        setFetchingReverse(false);
        setStep({ step: 0, data: step.data });
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
        setStep({ step: 0, data: step.data });
        const extabarResults = values.map(v => v.data.extabar_result);
        const bestResults = values.map(v => v.data.best_result);
        const knowledgeResults = values.map(v => v.data.knowledge_panel);
        setQueryResultsGoogle({
          a: {
            best: bestResults[0],
            exta: extabarResults[0],
            knowledge: knowledgeResults[0]
          },
          b: {
            best: bestResults[1],
            exta: extabarResults[1],
            knowledge: knowledgeResults[1]
          },
          c: {
            best: bestResults[2],
            exta: extabarResults[2],
            knowledge: knowledgeResults[2]
          }
        });
      })
      .catch(ignored => {
        setFetchingQuery(false);
        setStep({ step: 0, data: step.data });
        message.error("Failed to query search");
      });
  };

  return (
    <div>
      <Header
        onStartSearch={startSearch}
        onStartReverseSearch={startReverseSearch}
        onStartKeywordSearch={startKeywordSearch}
        onStartSentenceAnalysis={startSentenceAnalysis}
        mode={mode}
        replay={replay}
        replayable={replayable}
        query={query}
        setQuery={setQuery}
        spinning={step.step !== 0}
        results={searchResultsGoogle}
        detection={detectionResults}
      />
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
                {mode === SEARCH_MODES.AUTO_SEARCH.id && (
                  <div>
                    <Occurrence
                      detection={detectionResults}
                      results={searchResultsGoogle}
                      imageResults={imageResultsGoogle}
                      fetching={fetchingGoogle}
                      fetchingImages={fetchingImagesGoogle}
                    />
                  </div>
                )}
                {mode === SEARCH_MODES.REVERSE_IMAGE_SEARCH.id && (
                  <ReverseResults
                    results={reverseResultsGoogle}
                    fetching={fetchingReverse}
                  />
                )}
                {mode === SEARCH_MODES.KEYWORD_SEARCH.id && (
                  <div>
                    <Occurrence
                      detection={detectionResults}
                      results={queryResultsGoogle}
                      imageResults={{}}
                      fetching={fetchingQuery}
                      fetchingImages={false}
                    />
                  </div>
                )}
                {mode === SEARCH_MODES.SENTENCE_ANALYSIS.id && (
                  <SentenceAnalysis detectionResults={detectionResults} />
                )}
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
                <Flags />
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
                <Zodiacs />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="team" />
                    Ottomans
                  </span>
                }
                key="6"
              >
                <Ottomans />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <Icon type="rocket" />
                    Space
                  </span>
                }
                key="7"
              >
                <Space />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
      <KeywordModal
        visible={keywordModalVisible}
        keyword={query}
        close={() => setKeywordModalVisible(false)}
        submit={continueKeywordSearch}
        onChangeKeyword={setQuery}
      />
    </div>
  );
}

export default Dashboard;
