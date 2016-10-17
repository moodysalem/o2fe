import React, {DOM, PropTypes, Component, PureComponent} from "react";

export default class ProgressBar extends PureComponent {
  render() {
    return (
      <div className="progress indigo lighten-3">
        <div className="indeterminate indigo"></div>
      </div>
    );
  }
}