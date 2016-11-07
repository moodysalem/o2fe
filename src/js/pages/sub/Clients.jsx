import React, {PropTypes, PureComponent} from "react";
import ClientCard from "../comps/ClientCard";
import ConfirmActionModal from "../comps/ConfirmActionModal";
import ClientModal from "../comps/ClientModal";
import {NOTIFICATION_HANDLERS} from "../../util/shapes";
import EmptyState from "../comps/EmptyState";
import PaginatedList from "../comps/PaginatedList";
import {SlideRight} from "../comps/Animations";

export default class Clients extends PureComponent {
  static contextTypes = {
    dao: PropTypes.object.isRequired,
    ...NOTIFICATION_HANDLERS
  };

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  };

  state = {
    deleting: null,
    editing: null
  };

  handleEdit = editing => this.setState({editing});
  cancelEdit = () => this.handleEdit(null);
  handleAdd = () => this.handleEdit({application: {id: this.props.params.id}});
  handleSave = () => {
    const {editing} = this.state;
    const {dao, onError, onSuccess} = this.context;

    dao.clients.save(editing)
      .then(
        saved => {
          onSuccess(`Saved client ${saved.name}`);
          this.setState({editing: null});
          this.refs.clients.refresh();
        },
        onError
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
          this.setState({deleting: null});
          this.refs.clients.refresh();
        },
        onError
      );
  };

  renderClients = clients => {
    if (clients.length == 0) {
      return (
        <EmptyState icon="server">
          <button className="btn btn-flat" onClick={this.handleAdd}><i className="fa fa-plus"/></button>
        </EmptyState>
      );
    }

    return (
      <SlideRight>
        {
          clients.map(
            client => (
              <ClientCard key={client.id}
                          client={client}
                          onDelete={() => this.handleDelete(client)}
                          onEdit={() => this.handleEdit(client)}/>
            )
          )
        }
      </SlideRight>
    );
  };

  render() {
    const {deleting, editing} = this.state;
    const {dao} = this.context;
    const {id: applicationId} = this.props.params;

    return (
      <div>
        <ConfirmActionModal
          open={deleting != null}
          onConfirm={this.deleteClient}
          action={`Delete ${deleting ? deleting.name : null}?`}
          typeConfirm={deleting ? deleting.name : null}
          onClose={this.cancelDelete}/>

        <ClientModal
          value={editing}
          onChange={this.handleEdit}
          onSave={this.handleSave}
          onClose={this.cancelEdit}/>

        <div className="display-flex align-items-center">
          <p className="flow-text flex-grow-1">
            Define the clients that can utilize this application
          </p>
          <div>
            <button className="btn blue-grey darken-3 btn-floating" onClick={this.handleAdd}>
              <i className="fa fa-plus"/>
            </button>
          </div>
        </div>
        <PaginatedList ref="clients" crud={dao.clients} renderList={this.renderClients}
                       params={{applicationId}}/>
      </div>
    );
  }
}