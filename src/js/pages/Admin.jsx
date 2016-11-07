import React, {DOM, PropTypes, Component, PureComponent} from "react";
import {Link} from "react-router";
import ConfirmActionModal from "./comps/ConfirmActionModal";
import ApplicationCard from "./comps/ApplicationCard";
import ApplicationModal from "./comps/ApplicationModal";
import {NOTIFICATION_HANDLERS} from "../util/shapes";
import {SlideRight} from "./comps/Animations";
import PaginatedList from "./comps/PaginatedList";
import EmptyState from "./comps/EmptyState";

export default class Admin extends Component {
  static contextTypes = {
    dao: PropTypes.object.isRequired,
    ...NOTIFICATION_HANDLERS
  };

  state = {
    editing: null,
    deleting: null,
    totalCount: 0
  };

  createApplication = () => this.editApplication({});
  editApplication = (editing) => this.setState({editing});
  cancelEdit = () => this.editApplication(null);

  saveEdit = () => {
    const {dao, onError, onSuccess} = this.context;
    const {editing} = this.state;

    dao.applications.save(editing)
      .then(
        saved => {
          this.refs.apps.refresh();
          onSuccess(`Saved application ${saved.name}`);
          this.setState({editing: null});
        },
        onError
      );
  };

  deleteApplication = (deleting) => this.setState({deleting});
  cancelDelete = () => this.deleteApplication(null);
  confirmDelete = () => {
    const {deleting} = this.state;
    const {dao, onError, onSuccess} = this.context;
    this.setState({deleting: null});

    dao.applications.destroyId(deleting.id)
      .then(
        () => {
          onSuccess(`Deleted ${deleting.name}!`);
          this.refs.apps.refresh();
        },
        onError
      );
  };

  renderApps = applications => {
    if (applications.length == 0) {
      return (
        <EmptyState icon="folder" style={{textAlign: 'center'}}>
          <button type="button" className="btn btn-flat" onClick={this.createApplication}>
            <i className="fa fa-plus"/>
          </button>
        </EmptyState>
      );
    }

    return (
      <SlideRight>
        {
          applications.map(
            app => {
              return (
                <ApplicationCard application={app} key={app.id}
                                 onEdit={() => this.editApplication(app)}
                                 onDelete={() => this.deleteApplication(app)}/>
              );
            }
          )
        }
      </SlideRight>
    );
  };

  render() {
    const {deleting, editing} = this.state;
    const {dao} = this.context;

    return (
      <div className="container">
        <ConfirmActionModal
          open={deleting != null}
          action={deleting ? `Delete ${deleting.name}?` : null}
          typeConfirm={deleting ? deleting.name : null}
          onConfirm={this.confirmDelete}
          onClose={this.cancelDelete}/>
        <ApplicationModal
          onClose={this.cancelEdit}
          onChange={this.editApplication}
          onSave={this.saveEdit}
          value={editing}/>

        <header className="display-flex align-items-center justify-content-center flex-wrap-wrap">
          <h1 className="flex-grow-1">
            Your Apps
          </h1>
          <div className="flex-shrink-0">
            <button onClick={this.createApplication} className="btn blue-grey darken-3 btn-floating">
              <i className="fa fa-plus"/>
            </button>
          </div>
        </header>

        <article style={{marginTop: 30, marginBottom: 30}}>
          <PaginatedList ref="apps" crud={dao.applications} renderList={this.renderApps}/>
        </article>
      </div>
    );
  }
}