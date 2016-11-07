import React, {PropTypes, PureComponent} from "react";
import PaginatedList from "../comps/PaginatedList";
import EmptyState from "../comps/EmptyState";
import ScopesTable from "../comps/ScopesTable";
import ConfirmActionModal from "../comps/ConfirmActionModal";

export default class Scopes extends PureComponent {
  static contextTypes = {
    dao: PropTypes.object.isRequired
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
  handleDelete = deleting => this.setState({deleting});
  cancelDelete = () => this.handleDelete(null);
  handleConfirmDelete = () => {
    const {deleting} = this.state;
    const {dao, onError} = this.context;
    dao.scopes.destroyId(deleting.id)
      .then(
        () => this.refs.scopes.refresh(),
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

        <div className="display-flex align-items-center">
          <p className="flow-text flex-grow-1">
            Define scopes to assign to clients for users to authorize
          </p>
          <div>
            <button className="btn btn-floating blue-grey darken-3" onClick={this.handleAdd}><i className="fa fa-plus"/>
            </button>
          </div>
        </div>
        <PaginatedList ref="scopes" renderList={this.renderScopes} crud={dao.scopes} params={{applicationId}}/>
      </div>
    );
  }
}