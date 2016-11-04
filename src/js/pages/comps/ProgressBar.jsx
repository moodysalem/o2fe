import React, {DOM, PropTypes, Component, PureComponent} from "react";

export default class ProgressBar extends PureComponent {
  render() {
    return (
      <div className="progress blue-grey darken-3 lighten-3">
        <div className="indeterminate blue-grey darken-3"></div>
      </div>
    );
  }
}