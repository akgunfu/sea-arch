import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store, history } from "./store";
import { routes } from "./routes";
import { ConnectedRouter } from "connected-react-router";
import "./assets/styles/style";

import "antd/dist/antd.min.css";

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>{routes}</ConnectedRouter>
  </Provider>,
  document.getElementById("app")
);
