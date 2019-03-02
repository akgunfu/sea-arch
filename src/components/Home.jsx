import React, { useState } from "react";
import { api } from "../helpers/api";
import * as config from "../config/client";

import SearchContainer from './Search';
import SS from './SS';

const SS_ENDPOINT = config.endpoint + "screen-shot";

function Home() {
  const [q, setQ] = useState(null);
  const [s, setS] = useState(null);

  const ss = () => {
      setS(false);
    api
      .get(SS_ENDPOINT)
      .then(res => {
          setQ(null);
          setS(true);
          console.log(res);
      }).then(a => {
          api.get(config.endpoint + "ocr").then(r => {
              console.log(r);
              if(r.successful &&Object.keys(r.data).length ===2){
                  setQ(r.data);
              }
          })
        }
    )
      .catch(e => console.log(e));
  };

  return (
    <div className="home">
      <button onClick={ss}>SS</button>
        {s && <SS />}
        {q && <SearchContainer q={q} />}

    </div>
  );
}

export default Home;
