import React, { useState, useEffect } from "react";
import History from "./History";
import { api } from "../helpers/api";
import * as config from "../config/client";
import SearchContainer from "./Search";
import { EVENTS } from "./events";

import '../assets/styles/style';

function Dashboard() {
  const [timeLine, setTimeLine] = useState([]);

  const [detectionResults, setDetectionResults] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [step, setStep] = useState(0);

  const start = () => {
    setTimeLine([EVENTS.STARTED]);
    setStep(1);
  };

  const reset = () => {
    setDetectionResults({});
    setSearchResults({});
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
        search();
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

  const search = () => {
    setTimeLine([...timeLine, EVENTS.GOOGLE_SEARCH_REQUEST]);
    Promise.all([
      api.post(config.endpoint + "search", {
        question: detectionResults.question,
        choice: detectionResults.choices.a
      }),
      api.post(config.endpoint + "search", {
        question: detectionResults.question,
        choice: detectionResults.choices.b
      }),
      api.post(config.endpoint + "search", {
        question: detectionResults.question,
        choice: detectionResults.choices.c
      })
    ]).then(values => {
      console.log(values);
      const fail = values.map(v => v.successful).find(x => !x);
      if (fail) {
        setTimeLine([
          ...timeLine,
          EVENTS.GOOGLE_SEARCH_ERROR,
          EVENTS.READY_FOR_NEXT
        ]);
        setStep(0);
      } else {
        setTimeLine([...timeLine, EVENTS.GOOGLE_SEARCH_SUCCESS]);

        const results = values.map(v => v.data.result);
        setSearchResults({ a: results[0], b: results[1], c: results[2] });
      }
    });
  };


  return (
    <div className="cont">
      <div>
        <History events={timeLine} onStart={start} />
      </div>
      <div>
        <SearchContainer q={detectionResults} s={searchResults} />
      </div>

    </div>
  );
}

export default Dashboard;
