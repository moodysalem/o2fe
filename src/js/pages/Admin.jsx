import React, {DOM, PropTypes, Component, PureComponent} from "react";
import {Link} from "react-router";
import ProgressBar from "./comps/ProgressBar";
import join from "url-join";

export default class Admin extends Component {
  static contextTypes = {
    dao: PropTypes.object.isRequired,
    onError: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.loadApps();
  }

  state = {
    applications: null,
    editing: null,
    deleting: null
  };

  loadApps() {
    const {dao, onError}= this.context;
    dao.applications.get()
      .then(
        ({results: applications}) => this.setState({applications}),
        onError
      );
  }

  editApplication = (editing) => this.setState({editing});
  deleteApplication = (deleting) => this.setState({deleting});

  render() {
    const {applications} = this.state;

    return (
      <div className="container">
        <header className="display-flex align-items-center justify-content-center flex-wrap-wrap">
          <h1 className="flex-grow-1">
            Your Applications
          </h1>
          <div className="flex-shrink-0">
            <button className="btn"><i className="fa fa-plus"/> Create</button>
          </div>
        </header>

        <hr />

        <article>
          {
            applications != null ? applications.map(
              (application) => {
                const {id, name, description, logoUrl} = application;
                return (
                  <div className="card horizontal" key={id}>
                    <div className="card-image">
                      <img src={logoUrl}/>
                    </div>
                    <div className="card-stacked">
                      <div className="card-content">
                        <span className="card-title">{name}</span>
                        <p>
                          {description}
                        </p>
                      </div>
                      <div className="card-action">
                        <Link to={join('applications', id, 'clients')}>Clients</Link>
                        <Link to={join('applications', id, 'scopes')}>Scopes</Link>
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
                          this.editApplication(application);
                        }}>Edit</a>
                        <a href="#" className="red-text" onClick={(e) => {
                          e.preventDefault();
                          this.deleteApplication(application);
                        }}>Delete</a>
                      </div>
                    </div>
                  </div>
                );
              }
            ) : <ProgressBar/>
          }
        </article>
      </div>
    );
  }
}