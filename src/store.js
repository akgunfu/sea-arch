import { createStore, applyMiddleware } from "redux";
import { routerMiddleware, connectRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import thunkMiddleware from "redux-thunk";
import { rootReducer } from "./modules/reducers/index";

const history = createBrowserHistory();

let middlewares = [routerMiddleware(history), thunkMiddleware];

let middleware = applyMiddleware(...middlewares);

const store = createStore(connectRouter(history)(rootReducer), middleware);

export { store, history };
