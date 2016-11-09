import React, {PropTypes, PureComponent} from "react";

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
        </tr>
        </thead>
        <tbody>
        {
          users.map(
            ({id, email}) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{email}</td>
              </tr>
            )
          )
        }
        </tbody>
      </table>
    );
  }
}