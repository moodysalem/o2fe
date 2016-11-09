import React, {PropTypes, PureComponent} from "react";

export default class ScopesTable extends PureComponent {
  static propTypes = {
    scopes: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
  };

  render() {
    const {scopes, onDelete, onEdit} = this.props;

    return (
      <table className="responsive-table striped centered">
        <thead>
        <tr>
          <th>Name</th>
          <th>Display Name</th>
          <th>Description</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {
          scopes.map((scope) => {
            const {id, name, displayName, description} = scope;

            return (
              <tr key={id}>
                <td>{name}</td>
                <td>{displayName}</td>
                <td>{description}</td>
                <td>
                  <button className="btn btn-flat" onClick={() => onEdit(scope)}><i className="fa fa-pencil"/></button>
                  <button className="btn btn-flat" onClick={() => onDelete(scope)}><i className="fa fa-trash"/></button>
                </td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
    );
  }
}
