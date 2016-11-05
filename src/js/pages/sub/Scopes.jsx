import React, {PropTypes, PureComponent} from "react";
import PaginatedList from "../comps/PaginatedList";
import EmptyState from "../comps/EmptyState";

export default class Scopes extends PureComponent {
  static contextTypes = {
    dao: PropTypes.object.isRequired
  };

  renderScopes = scopes => {
    if (scopes.length == 0) {
      return <EmptyState>No scopes defined for this application</EmptyState>;
    }

    return (
      <table className="responsive-table">
        <thead>
        <tr>
          <th>Name</th>
          <th>Display Name</th>
          <th>Description</th>
        </tr>
        </thead>
        <tbody>
        {
          scopes.map(({id, name, displayName, description}) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{displayName}</td>
              <td>{description}</td>
            </tr>
          ))
        }
        </tbody>
      </table>
    )
  };

  render() {
    const {dao} = this.context;

    return (
      <div>
        <h2>Scopes</h2>
        <p>
          Scopes defined on this OAuth2 server can be requested by specific clients and allowed by users to limit what
          clients can access on your servers
        </p>
        <PaginatedList renderList={this.renderScopes} crud={dao.scopes}/>
      </div>
    );
  }
}