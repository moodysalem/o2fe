import React, {PropTypes, PureComponent} from "react";
import PaginatedList from "./PaginatedList";
import EmptyState from "./EmptyState";

export default class ClientScopes extends PureComponent {
  static contextTypes = {
    dao: PropTypes.object.isRequired
  };

  static propTypes = {
    client: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  };

  static defaultProps = {};

  renderClientScopes = clientScopes => {
    if (clientScopes.length == 0) {
      return <EmptyState icon="key"/>;
    }

    return (
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Priority</th>
          <th>Reason</th>
        </tr>
        </thead>
        <tbody>
        {
          clientScopes.map(
            ({scope:{name}, priority, reason}) => (
              <tr>
                <td>{name}</td>
                <td>{priority}</td>
                <td>{reason}</td>
              </tr>
            )
          )
        }
        </tbody>
      </table>
    );
  };

  render() {
    const {dao} = this.context,
      {client} = this.props;

    const {name} = client;

    return (
      <div>
        <h4>Scopes for <em>{name}</em></h4>
        <hr />
        <PaginatedList renderList={this.renderClientScopes} crud={dao.clientScopes} params={{clientId: client.id}}/>
      </div>
    );
  }
}