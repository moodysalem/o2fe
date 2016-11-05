import React from "react";
import {render} from "react-dom";
import App from "./App";
import getConfig from "./util/getConfig";
import {getTokenFromHash} from "./util/readHash";
import "../css/style.scss";
import Promise from "bluebird";

Promise.config({
  cancellation: true
});

const appEl = document.getElementById('app');

const token = getTokenFromHash();

getConfig()
  .then(
    config => render(<App config={config} tryToken={token}/>, appEl)
  )
  .catch(
    err => render(<div>{err.message}</div>, appEl)
  );