import React, {PropTypes, PureComponent} from "react";
import _ from "underscore";

export default class UsersTable extends PureComponent {
  static contextTypes = {};

  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static defaultProps = {};

  render() {
    const {users} = this.props;

    return (
      <table className="responsive-table striped centered">
        <thead>
        <tr>
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