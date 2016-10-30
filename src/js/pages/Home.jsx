import React, {PureComponent} from "react";

export default class Home extends PureComponent {
  render() {
    return (
      <div className="container" style={{paddingTop: 80}}>
        <h2><strong>OAuth2Cloud</strong> is the simplest way for you to authenticate users</h2>

        <p className="flow-text">
          Create a log in page for your project in under an hour
        </p>
      </div>
    );
  }
}