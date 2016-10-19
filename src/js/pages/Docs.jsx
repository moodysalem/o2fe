import React, {DOM, PropTypes, Component, PureComponent} from "react";

export default class Docs extends Component {
  handleLoad = () => {
    const {iframe} = this.refs;

    iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
  };

  render() {
    return (
      <div className="container">
        <h1>Documentation</h1>
        <p className="flow-text">
          Live API documentation is provided via <a href="https://swagger.io">Swagger</a>
        </p>
        <iframe onLoad={this.handleLoad}
                ref="iframe"
                style={{border: 'none', width: '100%', minHeight: 400}}
                src="http://moodysalem.github.io/oauth2-service-swagger/#/oauth2"/>
      </div>
    );
  }
}