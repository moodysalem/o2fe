import React, {PropTypes, PureComponent} from "react";
import PaginatedList from "../comps/PaginatedList";
import EmptyState from "../comps/EmptyState";
import ScopesTable from "../comps/ScopesTable";

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

  handleEdit = editing => this.setState({editing});
  handleDelete = deleting => this.setState({deleting});

  renderScopes = scopes => {
    if (scopes.length == 0) {
      return <EmptyState icon="crosshairs">No scopes defined for this application</EmptyState>;
    }

    return (
      <ScopesTable scopes={scopes} onDelete={this.handleDelete} onEdit={this.handleEdit}/>
    );
  };

  render() {
    const {dao} = this.context;
    const {id: applicationId} = this.props.params;

    return (
      <div>
        <p className="flow-text">
          Define scopes to assign to clients for users to authorize
        </p>
        <PaginatedList renderList={this.renderScopes} crud={dao.scopes} params={{applicationId}}/>
      </div>
    );
  }
}