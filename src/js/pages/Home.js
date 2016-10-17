import React, {PureComponent} from "react";

export default class Home extends PureComponent {
  render() {
    return (
      <div className="container">
        <h1>Simple Login</h1>
        <p className="flow-text">
          Authentication should be easy so you can work on the hard problems.
        </p>
      </div>
    );
  }
}