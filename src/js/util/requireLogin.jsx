import React, {Children, PropTypes, PureComponent} from "react";
import {TOKEN_SHAPE, CONFIG_SHAPE} from "./shapes";
import getLoginUrl from "./getLoginUrl";

/**
 * Returns a new component that renders the passed in component only when logged in
 * @param Original
 * @returns {ExpectsLogin}
 */
export default function requireLogin(Original) {
  return class ExpectsLogin extends PureComponent {
    static contextTypes = {
      token: TOKEN_SHAPE,
      config: CONFIG_SHAPE.isRequired
    };

    render() {
      const {token, config} = this.context;

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

      return <Original {...this.props}/>;
    }
  }
}