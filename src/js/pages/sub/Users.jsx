import React, {PropTypes, PureComponent} from "react";
import PaginatedList from "../comps/PaginatedList";
import EmptyState from "../comps/EmptyState";
import UsersTable from "../comps/UsersTable";

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
    merging: null
  };

  renderUsers = users => {
    if (users.length == 0) {
      return (
        <EmptyState icon="users"/>
      );
    }

    return (
      <UsersTable users={users}/>
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
        </div>

        <PaginatedList renderList={this.renderUsers} crud={dao.users} params={{applicationId}}/>
      </div>
    );
  }
}