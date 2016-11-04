import React, {PropTypes, PureComponent} from "react";
import Preloader from "../comps/Preloader";
import Pagination from "../comps/Pagination";
import {pageParams} from "../../util/params";
import ClientCard from "../comps/ClientCard";
import ConfirmActionModal from "../comps/ConfirmActionModal";
import {replace} from "../../util/replace";
import ClientModal from "../comps/ClientModal";
import {NOTIFICATION_HANDLERS} from "../../util/shapes";
import _ from 'underscore';

export default class Clients extends PureComponent {
  static contextTypes = {
    dao: PropTypes.object.isRequired,
    ...NOTIFICATION_HANDLERS
  };

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    application: PropTypes.object.isRequired
  };

  state = {
    clients: null,
    count: 0,
    pageInfo: {pageSize: 20, pageNo: 0},
    deleting: null,
    editing: null
  };

  componentDidMount() {
    this.refreshClients();
  }

  refreshClients = () => this.loadClients(this.props.params.id);

  loadClients(id) {
    const {dao} = this.context;
    const {pageInfo} = this.state;
    dao.clients.list({applicationId: id, ...pageParams(pageInfo)})
      .then(
        ({results:clients, totalCount: count}) => this.setState({clients, count})
      );
  }

  handlePageChange = (pageInfo) => this.setState({pageInfo}, () => this.loadClients(this.props.params.id));

  handleEdit = editing => this.setState({editing});
  cancelEdit = () => this.handleEdit(null);
  handleAdd = () => this.handleEdit({application: this.props.application});
  handleSave = () => {
    const {editing} = this.state;
    const {dao, onError, onSuccess} = this.context;

    this.setState({editing: null});

    dao.clients.save(editing)
      .then(
        saved => {
          onSuccess(`Saved client ${saved.name}`);
          if (editing.id) {
            this.setState({clients: replace(this.state.clients, saved)});
          } else {
            this.refreshClients();
          }
        },
        err => {
          onError(err);
          this.setState({editing});
        }
      );
  };

  handleDelete = (deleting) => this.setState({deleting});
  cancelDelete = () => this.handleDelete(null);
  deleteClient = () => {
    const {deleting} = this.state;
    const {dao, onError, onSuccess} = this.context;
    dao.clients.destroyId(deleting.id)
      .then(
        () => {
          onSuccess(`Successfully deleted client ${deleting.name}`);
          this.setState({deleting: null, clients: _.without(this.state.clients, deleting)});
        },
        onError
      );
  };

  render() {
    const {clients, pageInfo, count, deleting, editing} = this.state;

    return (
      <div>
        <ConfirmActionModal
          open={deleting != null}
          onConfirm={this.deleteClient}
          action={`Delete ${deleting ? deleting.name : null}?`}
          typeConfirm={deleting ? deleting.name : null}
          onClose={this.cancelDelete}/>

        <ClientModal
          client={editing}
          onChange={this.handleEdit}
          onSave={this.handleSave}
          onClose={this.cancelEdit}
          open={editing != null}/>

        <div className="display-flex align-items-center">
          <h2 className="flex-grow-1">Clients</h2>
          <div>
            <button className="btn blue-grey darken-3 btn-floating" onClick={this.handleAdd}><i className="fa fa-plus"/></button>
          </div>
        </div>
        {
          clients == null ? <Preloader centered={true}/> :
            clients.length > 0 ?
              clients.map(
                client => (
                  <ClientCard key={client.id}
                              client={client}
                              onDelete={() => this.handleDelete(client)}
                              onEdit={() => this.handleEdit(client)}/>
                )
              ) :
              <EmptyState icon="server">No clients for this application</EmptyState>
        }
        <Pagination value={pageInfo} onChange={this.handlePageChange} totalCount={count}/>
      </div>
    );
  }
}