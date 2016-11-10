import React, {PropTypes, PureComponent} from "react";
import _ from "underscore";
import Checkbox from "./Checkbox";

export default class UsersTable extends PureComponent {
  static contextTypes = {};

  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    checkedUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChangeChecked: PropTypes.func.isRequired
  };

  static defaultProps = {};

  checked = checked => this.props.onChangeChecked(checked);

  handleCheckAll = allChecked => {
    if (allChecked) {
      this.checked(this.props.users);
    } else {
      this.checked([]);
    }
  };

  handleCheck = (user, checked) => {
    const {checkedUsers} = this.props;
    if (checked) {
      this.checked(_.uniq([user].concat(checkedUsers || []), u => u.id));
    } else {
      this.checked(_.without(checkedUsers, user));
    }
  };

  render() {
    const {users, checkedUsers} = this.props;

    const byId = _.indexBy(checkedUsers, 'id'),
      isChecked = user => Boolean(byId[user.id]),
      allChecked = _.all(users, isChecked);

    return (
      <table className="responsive-table striped centered">
        <thead>
        <tr>
          {/*<th>*/}
            {/*<Checkbox checked={allChecked} onChange={e => this.handleCheckAll(e.target.checked)}/>*/}
          {/*</th>*/}
          <th>ID</th>
          <th>E-mail</th>
          <th>Aliases</th>
        </tr>
        </thead>
        <tbody>
        {
          users.map(
            user => {
              const {id, email, userGroup: users} = user;

              return (
                <tr key={id}>
                  {/*<td>*/}
                    {/*<Checkbox checked={isChecked(user)} onChange={e => this.handleCheck(user, e.target.checked)}/>*/}
                  {/*</td>*/}
                  <td>{id}</td>
                  <td>{email}</td>
                  <td>
                    {
                      users && users.length > 1 ?
                        _.chain(users).filter(user => user.id != id).map(({email: alias}) => alias).value().join(', ') :
                        <em className="grey-text">N/A</em>
                    }
                  </td>
                </tr>
              );
            }
          )
        }
        </tbody>
      </table>
    );
  }
}