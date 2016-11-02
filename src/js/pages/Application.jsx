import React, {PropTypes, Children, PureComponent} from "react";
import Preloader from "./comps/Preloader";
import {Link} from "react-router";
class Clients extends PureComponent {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  };


  render() {
    return (
      <div>
        <h2>WIP</h2>
        <p className="flow-text">This screen will be available soon...</p>
      </div>
    );
  }
}

class Scopes extends PureComponent {
  render() {
    return (
      <div>
        <h2>WIP</h2>
        <p className="flow-text">This screen will be available soon...</p>
      </div>
    );
  }
}

export default class Application extends PureComponent {
  static Clients = Clients;
  static Scopes = Scopes;

  static contextTypes = {
    dao: PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  };

  static defaultProps = {};

  state = {
    application: null
  };

  componentDidMount() {
    this.loadApplication(this.props.params.id);
  }

  loadApplication(id) {
    const {dao, onError} = this.context;

    dao.applications.get(id)
      .then(
        application => this.setState({application}),
        onError
      );
  }

  componentWillReceiveProps({params: {id: nextId}}) {
    if (nextId !== this.props.params.id) {
      this.setState({application: null});
      this.loadApplication(nextId);
    }
  }

  render() {
    const {children} = this.props;

    const {application} = this.state;
    if (!application) {
      return <Preloader centered={true}/>;
    }

    const {name} = application;

    return (
      <div className="container">
        <div className="display-flex align-items-center">
          <h1 className="flex-grow-1">{name}</h1>
          <div className="flex-shrink-0">
            <Link className="btn indigo" to="admin">
              <i className="fa fa-arrow-left"/> Back
            </Link>
          </div>
        </div>
        {children}
      </div>
    );
  }
}