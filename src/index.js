import React from "react";
import ReactDOM from "react-dom";
import "./common/style/index.css";
import App from "./components/App";
import { Provider } from "react-redux";
import rootReducer from "./RootReducer";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import { loadState, saveState } from "./common/util/localStorage";
import throttle from "lodash/throttle";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedState = loadState();
const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(thunk))
);
store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 1000)
);
const theme = createMuiTheme({});
ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);
