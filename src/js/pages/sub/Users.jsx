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
    merging: null,
    checkedUsers: []
  };

  renderUsers = users => {
    if (users.length == 0) {
      return (
        <EmptyState icon="users"/>
      );
    }

    const {checkedUsers} = this.state;

    return (
      <UsersTable users={users} checkedUsers={checkedUsers} onChangeChecked={this.handleChangeChecked}/>
    );
  };

  handleChangeChecked = checkedUsers => this.setState({checkedUsers});

  render() {
    const {dao} = this.context;
    const {id: applicationId} = this.props.params,
      {checkedUsers} = this.state;

    return (
      <div>
        <div className="display-flex align-items-center">
          <p className="flow-text flex-grow-1">
            Find users that have used this application
          </p>

          {/*<div>*/}
            {/*<button className="btn btn-round" disabled={checkedUsers.length < 2}>*/}
              {/*<i className="fa fa-compress"/> Merge*/}
            {/*</button>*/}
          {/*</div>*/}
        </div>

        <PaginatedList renderList={this.renderUsers} crud={dao.users} params={{applicationId}}/>
      </div>
    );
  }
}