import React, {PropTypes, PureComponent} from "react";
import PaginatedList from "../comps/PaginatedList";
import EmptyState from "../comps/EmptyState";
import UsersTable from "../comps/UsersTable";
import Modal from "../comps/Modal";

const MergeModal = ({merging, onClose, onSave, onChange}) => (
  <Modal open={merging != null} onClose={onClose}>
    <Modal.Content>
      <h4>Merge Users</h4>
      <p className="flow-text">This feature is a WIP.</p>
      {/*{merging != null ? <MergeForm merging={merging} onChange={onChange}/> : null}*/}
    </Modal.Content>
    <Modal.Footer>
      <Modal.Action disabled={true} onClick={onSave}>Merge</Modal.Action>
      <Modal.Action onClick={onClose}>Cancel</Modal.Action>
    </Modal.Footer>
  </Modal>
);

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

    const {checkedUsers} = this.state;

    return (
      <UsersTable users={users} checkedUsers={checkedUsers} onChangeChecked={this.handleChangeChecked}/>
    );
  };

  changeMergeUsers = merging => this.setState({merging});
  startMerging = () => this.changeMergeUsers([]);
  cancelMerging = () => this.changeMergeUsers(null);

  doMerge = () => {
    const {merging} = this.state;
    this.cancelMerging();
  };

  render() {
    const {dao} = this.context;
    const {id: applicationId} = this.props.params;

    const {merging} = this.state;

    return (
      <div>
        <div className="display-flex align-items-center">
          <p className="flow-text flex-grow-1">
            Find users that have used this application
          </p>

          <div>
            <button className="btn blue-grey darken-3" onClick={this.startMerging}>
              <i className="fa fa-compress"/> Merge
            </button>
          </div>
        </div>

        <MergeModal merging={merging} onClose={this.cancelMerging} onChange={this.changeMergeUsers}
                    onSave={this.doMerge}/>

        <PaginatedList renderList={this.renderUsers} crud={dao.users} params={{applicationId}}/>
      </div>
    );
  }
}