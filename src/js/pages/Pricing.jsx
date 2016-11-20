import React, {PropTypes, PureComponent} from "react";

export default class Pricing extends PureComponent {
  render() {
    return (
      <div className="container">
        <h1>Pricing</h1>

        <table className="repsonsive-table bordered centered">
          <thead>
          <tr>
            <th># Users</th>
            <th>Pricing ($USD/month)</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>&lt; 1000</td>
            <td>Free Forever</td>
          </tr>
          <tr>
            <td>&gt;= 1000</td>
            <td>
              <a href="mailto:moody.salem@gmail.com?subject=OAuth2Cloud Pricing Inquiry">Contact Us</a>
            </td>
          </tr>
          </tbody>
        </table>

        <p className="grey-text">
          OAuth2Cloud is a beta service and the pricing model is subject to change.
        </p>
      </div>
    );
  }
}