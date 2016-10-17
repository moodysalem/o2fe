import config from "file?name=config.json!../config.json";
import React from "react";
import {render} from "react-dom";
import App from "./App";

const appEl = document.getElementById('app');

fetch(config)
  .then(
    res => res.json()
  )
  .then(
    config => render(<App config={config}/>, appEl)
  )
  .catch(
    err => render(<div>{err.message}</div>, appEl)
  );

