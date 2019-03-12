import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/index";
import logger from "redux-logger";
import promise from "redux-promise-middleware";
import { default as thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {
    auth: {
        user: null,
        fetching: false,
        error: false
    },
}

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(logger, thunk, promise())))

export default store
