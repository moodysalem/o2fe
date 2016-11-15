import React, {PropTypes, PureComponent} from "react";

export default class Pricing extends PureComponent {
  render() {
    return (
      <div className="container">
        <h1>Pricing</h1>
        <p className="flow-text">
          OAuth2Cloud is a beta service.
          For all pricing inquiries, please contact <a href="mailto:moody.salem@gmail.com">moody.salem@gmail.com</a>.
        </p>
      </div>
    );
  }
}