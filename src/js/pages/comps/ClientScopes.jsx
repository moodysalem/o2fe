import React, {PropTypes, PureComponent} from "react";
import EmptyState from "./EmptyState";
import _ from "underscore";
import Promise from "bluebird";
import {NOTIFICATION_HANDLERS} from "../../util/shapes";
import Loading from "./Loading";

const DELETE_CLIENT_SCOPE = 'DELETE';

const Priorities = props => (
  <select {...props} className="browser-default">
    <option value={DELETE_CLIENT_SCOPE}>N/A</option>
    <option value="ASK">Ask</option>
    <option value="REQUIRED">Required</option>
    <option value="REQUIRED_HIDDEN">Required & Hidden</option>
  </select>
);

const ClientScopesTable = ({scopes, clientScopes, onChange}) => {
  const byScopeId = _.indexBy(clientScopes, cs => cs.scope.id);

  const handleChange = ({clientScope, changed}) => {
    if (!clientScope) {
      onChange([changed].concat(clientScopes));
    } else {
      const indexOf = _.indexOf(clientScopes, clientScope);
      const nu = [...clientScopes];
      nu.splice(indexOf, 1, {...clientScope, ...changed});
      onChange(nu);
    }
  };

  return (
    <table className="responsive-table centered">
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
          scope => {
            const {id, name} = scope;
            const clientScope = byScopeId[id];

            return (
              <tr key={id}>
                <td>{name}</td>
                <td>
                  <Priorities value={clientScope ? clientScope.priority : 'N/A'}
                              onChange={e => handleChange({clientScope, changed: {scope, priority: e.target.value}})}/>
                </td>
                <td>
                  <textarea className="materialize-textarea" value={(clientScope ? clientScope.reason : null) || ''}
                            onChange={e => handleChange({clientScope, changed: {scope, reason: e.target.value}})}
                            placeholder="N/A"
                            disabled={!clientScope || clientScope.priority === DELETE_CLIENT_SCOPE}/>
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
    dao: PropTypes.object.isRequired,
    ...NOTIFICATION_HANDLERS
  };

  static propTypes = {
    client: PropTypes.shape({
      id: PropTypes.string.isRequired,
      application: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  static defaultProps = {};

  state = {
    clientScopes: [],
    scopes: [],
    promise: null
  };

  componentDidMount() {
    this.loadData(this.props.client);
  }

  componentWillReceiveProps({client}) {
    if (client !== this.props.client) {
      this.loadData(client);
    }
  }

  loadData({id: clientId, application: {id: applicationId}}) {
    const {dao, onError} = this.context;

    this.setState({
      promise: Promise.all([
        dao.clientScopes.list({clientId}),
        dao.scopes.list({applicationId})
      ]).then(
        ([{results: clientScopes}, {results: scopes}]) => this.setState({clientScopes, scopes, promise: null}),
        onError
      )
    });
  }

  handleClientScopesChange = clientScopes => this.setState({clientScopes});

  renderScopes = () => {
    const {clientScopes, scopes} = this.state;

    if (scopes.length == 0) {
      return <EmptyState icon="key"/>;
    }

    if (clientScopes == null) {
      return <EmptyState icon="key"/>;
    }

    return (
      <ClientScopesTable scopes={scopes} clientScopes={clientScopes} onChange={this.handleClientScopesChange}/>
    );
  };

  saveChanges = () => {
    const {client} = this.props;
    const {clientScopes} = this.state;
    const {dao, onError, onSuccess} = this.context;

    const toDelete = _.filter(clientScopes, cs => cs.priority === DELETE_CLIENT_SCOPE),
      toSave = _.filter(clientScopes, cs => cs.priority !== DELETE_CLIENT_SCOPE);

    const promises = [
      dao.clientScopes.save(_.map(toSave, cs => ({...cs, client})))
    ].concat(_.map(toDelete, cs => dao.clientScopes.destroyId(cs.id)));

    this.setState({
      promise: Promise.all(promises)
        .then(
          ([clientScopes]) => {
            this.setState({clientScopes, promise: null});
            onSuccess(`Successfully committed changes!`);
          },
          onError
        )
    });
  };

  render() {
    const {client} = this.props;
    const {promise} = this.state;

    const {name} = client;

    return (
      <div>
        <h4>
          Client Scopes for <em>{name}</em>
        </h4>
        <Loading loading={promise != null}>
          {this.renderScopes()}

          <div style={{textAlign: 'center'}}>
            <button className="btn" onClick={this.saveChanges}><i className="fa fa-save"/> Commit</button>
          </div>
        </Loading>
      </div>
    );
  }
}