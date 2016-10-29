import React from "react";
import {render} from "react-dom";
import App from "./App";

const appEl = document.getElementById('app');

try {
  render(<App/>, appEl);
} catch (err) {
  render(<div>{err.message}</div>, appEl);
}