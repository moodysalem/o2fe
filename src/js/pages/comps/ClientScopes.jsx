import React, {PropTypes, PureComponent} from "react";
import PaginatedList from "./PaginatedList";
import EmptyState from "./EmptyState";
import _ from "underscore";

const Priorities = props => (
  <select {...props} className="browser-default">
    <option value="N/A">N/A</option>
    <option value="ASK">Ask</option>
    <option value="REQUIRED">Required</option>
    <option value="REQUIRED_HIDDEN">Required & Hidden</option>
  </select>
);

const ClientScopesTable = ({scopes, clientScopes}) => {
  const byScope = _.indexBy(clientScopes, cs => cs.scope.id);

  return (
    <table className="responsive-table striped">
      <thead>
      <tr>
        <th>Name</th>
        <th>Priority</th>
        <th>Reason</th>
      </tr>
      </thead>
      <tbody>
      {
        scopes.map(
          ({id, name}) => {
            const clientScope = byScope[id];

            return (
              <tr key={id}>
                <td>{name}</td>
                <td>
                  <Priorities value={clientScope ? clientScope.priority : 'N/A'}
                              onChange={e => alert('Coming soon...')}/>
                </td>
                <td>
                  <textarea className="materialize-textarea" value={clientScope ? clientScope.reason : 'N/A'}
                            onChange={e => alert('Coming soon...')}
                            disabled={!clientScope}/>
                </td>
              </tr>
            );
          }
        )
      }
      </tbody>
    </table>
  );
};

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

  state = {
    clientScopes: null
  };

  componentDidMount() {
    this.loadClientScopes(this.props.client.id);
  }

  componentWillReceiveProps({client}) {
    if (client.id !== this.props.client.id) {
      this.loadClientScopes(client.id);
    }
  }

  loadClientScopes(clientId) {
    const {dao} = this.context;
    dao.clientScopes.list({clientId})
      .then(({results: clientScopes}) => this.setState({clientScopes}));
  }

  renderScopes = scopes => {
    const {clientScopes} = this.state;

    if (scopes.length == 0) {
      return <EmptyState icon="key"/>;
    }

    if (clientScopes == null) {
      return <EmptyState icon="key"/>;
    }

    return <ClientScopesTable scopes={scopes} clientScopes={clientScopes}/>;
  };

  render() {
    const {dao} = this.context,
      {client} = this.props;

    const {name} = client;

    return (
      <div>
        <h4>Client Scopes for <em>{name}</em></h4>
        <PaginatedList renderList={this.renderScopes} crud={dao.scopes}
                       params={{applicationId: client.application.id}}/>
      </div>
    );
  }
}