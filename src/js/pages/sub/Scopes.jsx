import React, {PropTypes, PureComponent} from "react";
import PaginatedList from "../comps/PaginatedList";
import EmptyState from "../comps/EmptyState";
import ScopesTable from "../comps/ScopesTable";
import ConfirmActionModal from "../comps/ConfirmActionModal";
import {NOTIFICATION_HANDLERS} from "../../util/shapes";
import FormModal from "../comps/FormModal";
import ScopeForm from "../comps/ScopeForm";

const ScopeModal = props => <FormModal {...props} objectName="Scope" objectForm={ScopeForm}/>;

export default class Scopes extends PureComponent {
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
    editing: null, deleting: null
  };

  handleAdd = () => this.setState({editing: {application: {id: this.props.params.id}}});
  handleEdit = editing => this.setState({editing});
  cancelEdit = () => this.handleEdit(null);
  saveScope = () => {
    const {editing} = this.state;
    const {dao, onError, onSuccess} = this.context;

    dao.scopes.save(editing)
      .then(
        scope => {
          this.refs.scopes.refresh();
          onSuccess(`Saved scope ${scope.name}`);
          this.setState({editing: null});
        },
        onError
      );
  };


  handleDelete = deleting => this.setState({deleting});
  cancelDelete = () => this.handleDelete(null);
  handleConfirmDelete = () => {
    const {deleting} = this.state;
    const {dao, onError, onSuccess} = this.context;

    dao.scopes.destroyId(deleting.id)
      .then(
        scope => {
          this.refs.scopes.refresh();
          this.setState({deleting: null});
          onSuccess(`Saved scope ${scope.name}`);
        },
        onError
      );
  };

  renderScopes = scopes => {
    if (scopes.length == 0) {
      return (
        <EmptyState icon="crosshairs">
          <button className="btn btn-flat" onClick={this.handleAdd}><i className="fa fa-plus"/></button>
        </EmptyState>
      );
    }

    return (
      <ScopesTable scopes={scopes} onDelete={this.handleDelete} onEdit={this.handleEdit}/>
    );
  };

  render() {
    const {dao} = this.context;
    const {id: applicationId} = this.props.params;
    const {deleting, editing} = this.state;

    return (
      <div>
        <ConfirmActionModal onConfirm={this.handleConfirmDelete} onClose={this.cancelDelete}
                            typeConfirm={deleting ? deleting.name : null}
                            open={deleting != null}
                            action={`Delete scope ${deleting ? deleting.name : null}`}/>

        <ScopeModal
          value={editing}
          onChange={this.handleEdit}
          onClose={this.cancelEdit}
          onSave={this.saveScope}/>

        <div className="display-flex align-items-center">
          <p className="flow-text flex-grow-1">
            Define scopes to assign to clients for users to authorize
          </p>
          <div>
            <button className="btn btn-floating blue-grey darken-3" onClick={this.handleAdd}>
              <i className="fa fa-plus"/>
            </button>
          </div>
        </div>
        <PaginatedList ref="scopes" renderList={this.renderScopes} crud={dao.scopes} params={{applicationId}}/>
      </div>
    );
  }
}