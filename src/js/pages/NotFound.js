import React, {Component} from "react";
import {Link} from "react-router";

export default class NotFound extends Component {
  render() {
    return (
      <div className="container">
        <h1>404: Not Found</h1>
        <p>The URL you entered is not valid. Click <Link to="">here</Link> to go home.</p>
      </div>
    );
  }
}