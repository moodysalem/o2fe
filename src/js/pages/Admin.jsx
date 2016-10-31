import React, {DOM, PropTypes, Component, PureComponent} from "react";
import {Link} from "react-router";
import ProgressBar from "./comps/ProgressBar";
import join from "url-join";
import Pagination from "./comps/Pagination";
import {pageParams} from "../util/params";
import Modal from "./comps/Modal";
import {replace} from "../util/replace";
import _ from "underscore";

const ApplicationCard = ({application:{id, name, description, supportEmail}, onEdit, onDelete}) => (
  <div className="card" key={id}>
    <div className="card-content">
      <span className="card-title">
        {name}
        <small style={{marginLeft: 4}}>{supportEmail}</small>
      </span>
      <p>{description}</p>
    </div>
    <div className="card-action">
      <Link to={join('applications', id, 'clients')}>Clients</Link>
      <Link to={join('applications', id, 'scopes')}>Scopes</Link>
      <a href="#" onClick={(e) => {
        e.preventDefault();
        onEdit();
      }}>Edit</a>
      <a href="#" className="red-text" onClick={(e) => {
        e.preventDefault();
        onDelete();
      }}>Delete</a>
    </div>
  </div>
);

class ApplicationForm extends PureComponent {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  handleChange = (more) => this.props.onChange({...this.props.value, ...more});
  handleCredentialsChange = more => {
    const {googleCredentials} = this.props.value;
    const after = {...googleCredentials, ...more};

    if ((!after.id || after.id.length == 0) && (!after.secret || after.secret.length == 0)) {
      this.handleChange({googleCredentials: null});
    } else {
      this.handleChange({googleCredentials: after});
    }
  };

  render() {
    const {value} = this.props;

    const {name, description, faviconUrl, googleCredentials, logoUrl, stylesheetUrl, supportEmail} = value;

    return (
      <form onSubmit={e => e.preventDefault()}>
        <fieldset>
          <div>
            <label>Name</label>
            <input type="text" value={name || ''} onChange={e => this.handleChange({name: e.target.value})}
                   className="validate"
                   required placeholder="Name"/>
          </div>

          <div>
            <label>Support E-mail</label>
            <input type="text" value={supportEmail || ''}
                   onChange={e => this.handleChange({supportEmail: e.target.value})}
                   required placeholder="Support E-mail"/>
          </div>

          <div>
            <label>Description</label>
            <textarea className="materialize-textarea" value={description || ''} placeholder="Description"
                      onChange={e => this.handleChange({description: e.target.value})}/>
          </div>
        </fieldset>

        <fieldset style={{marginTop: 24}}>
          <div>
            <label>Favicon URL</label>
            <input type="text" value={faviconUrl || ''} onChange={e => this.handleChange({faviconUrl: e.target.value})}
                   placeholder="Favicon URL"/>
          </div>

          <div>
            <label>Logo URL</label>
            <input type="text" value={logoUrl || ''} onChange={e => this.handleChange({logoUrl: e.target.value})}
                   placeholder="Logo URL"/>
          </div>

          <div>
            <label>Stylesheet URL</label>
            <input type="text" value={stylesheetUrl || ''}
                   onChange={e => this.handleChange({stylesheetUrl: e.target.value})}
                   placeholder="Stylesheet URL"/>
          </div>
        </fieldset>

        <fieldset style={{marginTop: 24}}>
          <div>
            <label>Google Client ID</label>
            <input type="text" value={googleCredentials ? (googleCredentials.id || '') : ''}
                   onChange={e => this.handleCredentialsChange({id: e.target.value})}
                   placeholder="Google Client ID"/>
          </div>

          <div>
            <label>Google Client Secret</label>
            <input type="text" value={googleCredentials ? (googleCredentials.secret || '') : ''}
                   onChange={e => this.handleCredentialsChange({secret: e.target.value})}
                   placeholder="Google Client Secret"/>
          </div>
        </fieldset>
      </form>
    );
  }
}

const ConfirmActionModal = ({action, onConfirm, onClose, ...rest}) => (
  <Modal onClose={onClose} {...rest}>
    <Modal.Content>
      <h4>{action}</h4>
    </Modal.Content>
    <Modal.Footer>
      <Modal.Action onClick={onConfirm}>Continue</Modal.Action>
      <Modal.Action onClick={onClose}>Cancel</Modal.Action>
    </Modal.Footer>
  </Modal>
);

const EditApplicationModal = ({application, open, onSave, onChange, onClose, ...rest}) => (
  <Modal onClose={onClose} open={open} {...rest}>
    <Modal.Content>
      <h4>{application != null && application.id ? 'Edit Application' : 'Create Application'}</h4>
      {
        open ? (
          <ApplicationForm value={application} onChange={onChange}/>
        ) : null
      }
    </Modal.Content>
    <Modal.Footer>
      <Modal.Action onClick={onSave}>Save</Modal.Action>
      <Modal.Action onClick={onClose}>Cancel</Modal.Action>
    </Modal.Footer>
  </Modal>
);

export default class Admin extends Component {
  static contextTypes = {
    dao: PropTypes.object.isRequired,
    onError: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired
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

  render() {
    const {applications, totalCount, pageInfo, deleting, editing} = this.state;

    return (
      <div className="container">
        <ConfirmActionModal
          open={deleting != null}
          action={deleting ? `Delete ${deleting.name}?` : null}
          onConfirm={this.confirmDelete}
          onClose={this.cancelDelete}/>
        <EditApplicationModal
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
            <button onClick={this.createApplication} className="btn"><i className="fa fa-plus"/> Create</button>
          </div>
        </header>

        <article style={{marginTop: 30, marginBottom: 30}}>
          {
            applications != null ? applications.map(
              app => {
                return (
                  <ApplicationCard application={app} key={app.id}
                                   onEdit={() => this.editApplication(app)}
                                   onDelete={() => this.deleteApplication(app)}
                  />
                );
              }
            ) : <ProgressBar/>
          }
        </article>

        <Pagination totalCount={totalCount} value={pageInfo} onChange={this.handlePageChange}/>
      </div>
    );
  }
}