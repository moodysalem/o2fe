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

  renderUsers = users => {
    if (users.length == 0) {
      return <EmptyState icon="users">No users for this application</EmptyState>;
    }

    return (
      null
    );
  };

  render() {
    const {dao} = this.context;
    const {id: applicationId} = this.props.params;

    return (
      <div>
        <div className="display-flex align-items-center">
          <p className="flow-text flex-grow-1">
            Find users that have used this application
          </p>
          <div>
            <button className="btn blue-grey darken-3 btn-floating" onClick={this.handleAdd}>
              <i className="fa fa-plus"/>
            </button>
          </div>
        </div>

        <PaginatedList renderList={this.renderUsers} crud={dao.users} params={{applicationId}}/>
      </div>
    );
  }
}