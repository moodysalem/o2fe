import React, {Children, PropTypes, PureComponent} from "react";
import {TOKEN_SHAPE, CONFIG_SHAPE} from "../../util/shapes";
import getLoginUrl from "../../util/getLoginUrl";

export default class RequireLogin extends PureComponent {
  static contextTypes = {
    token: TOKEN_SHAPE,
    config: CONFIG_SHAPE
  };

  render() {
    const {token, config} = this.context;
    const {children} = this.props;

    if (!token) {
      return (
        <div className="container">
          <h1>401: Requires Log In</h1>
          <p className="flow-text">
            You must be logged in to access this page. Click <a href={getLoginUrl(config)}>here</a> to log in.
          </p>
        </div>
      );
    }

    return Children.only(children);
  }
}