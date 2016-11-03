import React, {DOM, PropTypes, Component, PureComponent} from "react";
import {Link} from "react-router";
import Preloader from "./comps/Preloader";
import Pagination from "./comps/Pagination";
import {pageParams} from "../util/params";
import {replace} from "../util/replace";
import _ from "underscore";
import EmptyState from "./comps/EmptyState";
import ConfirmActionModal from "./comps/ConfirmActionModal";
import ApplicationCard from "./comps/ApplicationCard";
import ApplicationModal from "./comps/ApplicationModal";
import {NOTIFICATION_HANDLERS} from "../util/shapes";

export default class Admin extends Component {
  static contextTypes = {
    dao: PropTypes.object.isRequired,
    ...NOTIFICATION_HANDLERS
  };

  componentDidMount() {
    this.loadApps();
  }

  state = {
    applications: null,
    editing: null,
    deleting: null,
    totalCount: 0,
    pageInfo: {pageNo: 0, pageSize: 20}
  };

  loadApps = () => {
    const {dao, onError}= this.context;
    const {pageInfo} = this.state;

    dao.applications.list({
      ...pageParams(pageInfo)
    }).then(
      ({results: applications, totalCount}) => this.setState({applications, totalCount}),
      onError
    );
  };

  handlePageChange = (pageInfo) => this.setState({pageInfo}, this.loadApps);

  createApplication = () => this.editApplication({});
  editApplication = (editing) => this.setState({editing});
  cancelEdit = () => this.editApplication(null);

  saveEdit = () => {
    const {dao, onError, onSuccess} = this.context;
    const {editing} = this.state;

    this.setState({editing: null});

    dao.applications.save(editing)
      .then(
        saved => {
          onSuccess(`Saved ${saved.name}!`);
          if (editing.id) {
            this.setState({applications: replace(this.state.applications, saved)})
          } else {
            this.loadApps();
          }
        },
        err => {
          onError(err);
          this.setState({editing});
        }
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
          this.setState({applications: _.without(this.state.applications, deleting)});
        },
        err => {
          onError(err);
        }
      );
  };

  renderApps() {
    const {applications} = this.state;

    if (applications == null) {
      return <Preloader centered={true}/>;
    }

    if (applications.length == 0) {
      return (
        <EmptyState style={{textAlign: 'center'}}>
          <div>There's nothing here</div>
        </EmptyState>
      );
    }

    return applications.map(
      app => {
        return (
          <ApplicationCard application={app} key={app.id}
                           onEdit={() => this.editApplication(app)}
                           onDelete={() => this.deleteApplication(app)}
          />
        );
      }
    );
  }

  render() {
    const {totalCount, pageInfo, deleting, editing} = this.state;

    return (
      <div className="container">
        <ConfirmActionModal
          open={deleting != null}
          action={deleting ? `Delete ${deleting.name}?` : null}
          typeConfirm={deleting ? deleting.name : null}
          onConfirm={this.confirmDelete}
          onClose={this.cancelDelete}/>
        <ApplicationModal
          open={editing != null}
          onClose={this.cancelEdit}
          onChange={this.editApplication}
          onSave={this.saveEdit}
          application={editing}/>

        <header className="display-flex align-items-center justify-content-center flex-wrap-wrap">
          <h1 className="flex-grow-1">
            Your Apps
          </h1>
          <div className="flex-shrink-0">
            <button onClick={this.createApplication} className="btn indigo btn-floating">
              <i className="fa fa-plus"/>
            </button>
          </div>
        </header>

        <article style={{marginTop: 30, marginBottom: 30}}>
          {
            this.renderApps()
          }
        </article>

        <Pagination totalCount={totalCount} value={pageInfo} onChange={this.handlePageChange}/>
      </div>
    );
  }
}