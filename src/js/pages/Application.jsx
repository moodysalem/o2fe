import React, {PropTypes, Children, PureComponent} from "react";
import Preloader from "./comps/Preloader";
import {Link} from "react-router";
import EmptyState from "./comps/EmptyState";
import {pageParams} from "../util/params";
import Pagination from "./comps/Pagination";

const ClientCard = ({
  onEdit, onDelete,
  client: {
    id, name, confidential, credentials: {id: cid, secret: secret}, flows,
    loginCodeTtl, refreshTokenTtl, showPromptNoScopes, tokenTtl, uris
  }
}) => (
  <div className="card" key={id}>
    <div className="card-content">
                    <span className="card-title">
                      {name}
                      {confidential ? <i className="fa fa-user-secret"/> : null}
                    </span>
      <div>
        <div>
          <label>Client ID</label>
          <div style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{cid}</div>
        </div>
        <div>
          <label>Client Secret</label>
          <div style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{secret}</div>
        </div>
        <div>
          <label>Flows</label>
          <div>{flows.join(', ')}</div>
        </div>
        <div>
          <label>Allowed URIs</label>
          <div>
            {
              uris.map(uri => <div key={uri}>{uri}</div>)
            }
          </div>
        </div>
        <div>
          <label>TTLs</label>
          <div className="display-flex flex-wrap-wrap">
            <div style={{marginRight: 20}}>
              <label>Login Code</label>
              <div>{loginCodeTtl}s</div>
            </div>
            <div style={{marginRight: 20}}>
              <label>Token</label>
              <div>{tokenTtl}s</div>
            </div>
            <div>
              <label>Refresh Token</label>
              <div>{refreshTokenTtl ? `${refreshTokenTtl}s` : <em>N/A</em>}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="card-action">
      <a href="#" onClick={e => {
        e.preventDefault();
        onEdit();
      }}>Edit</a>
      <a href="#" className="red-text" onClick={(e) => {
        e.preventDefault();
        onDelete();
      }}>Delete</a>
    </div>
  </div>
);

class Clients extends PureComponent {
  static contextTypes = {
    dao: PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  };

  state = {
    clients: null,
    count: 0,
    pageInfo: {pageSize: 20, pageNo: 0}
  };

  componentDidMount() {
    this.loadClients(this.props.params.id);
  }

  loadClients(id) {
    const {dao} = this.context;
    const {pageInfo} = this.state;
    dao.clients.list({applicationId: id, ...pageParams(pageInfo)})
      .then(
        ({results:clients, totalCount: count}) => this.setState({clients, count})
      );
  }

  handlePageChange = (pageInfo) => {
    this.setState({pageInfo}, () => this.loadClients(this.props.params.id));
  };

  render() {
    const {clients, pageInfo, count} = this.state;

    return (
      <div>
        <h2>Clients</h2>
        {
          clients == null ? <Preloader/> :
            clients.length > 0 ?
              clients.map(client => <ClientCard key={client.id} client={client}/>) :
              <EmptyState icon="server">No clients for this application</EmptyState>
        }
        <Pagination value={pageInfo} onChange={this.handlePageChange} totalCount={count}/>
      </div>
    );
  }
}

class Scopes extends PureComponent {
  render() {
    return (
      <div>
        <h2>WIP</h2>
        <p className="flow-text">This screen will be available soon...</p>
      </div>
    );
  }
}

export default class Application extends PureComponent {
  static Clients = Clients;
  static Scopes = Scopes;

  static contextTypes = {
    dao: PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  };

  static defaultProps = {};

  state = {
    application: null
  };

  componentDidMount() {
    this.loadApplication(this.props.params.id);
  }

  loadApplication(id) {
    const {dao, onError} = this.context;

    dao.applications.get(id)
      .then(
        application => this.setState({application}),
        onError
      );
  }

  componentWillReceiveProps({params: {id: nextId}}) {
    if (nextId !== this.props.params.id) {
      this.setState({application: null});
      this.loadApplication(nextId);
    }
  }

  render() {
    const {children} = this.props;

    const {application} = this.state;
    if (!application) {
      return <Preloader centered={true}/>;
    }

    const {name} = application;

    return (
      <div className="container">
        <div className="display-flex align-items-center">
          <h1 className="flex-grow-1">{name}</h1>
          <div className="flex-shrink-0">
            <Link className="btn indigo" to="admin">
              <i className="fa fa-arrow-left"/> Back
            </Link>
          </div>
        </div>
        {children}
      </div>
    );
  }
}