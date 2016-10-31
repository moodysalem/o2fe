import React, {PropTypes, Children, PureComponent} from "react";

class Clients extends PureComponent {
  render() {
    return (<div></div>);
  }
}

class Scopes extends PureComponent {
  render() {
    return (<div></div>);
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
      id: PropTypes.string.isRequired,
      section: PropTypes.oneOf(['clients', 'scopes', 'users']).isRequired
    }).isRequired
  };

  static defaultProps = {};

  componentDidMount() {
    this.loadApplication();
  }

  loadApplication() {
    const { dao } = this.context;

    dao.applications.get()
  }

  render() {
    const {children} = this.props;

    return (
      <div className="container">
        <h1>WIP</h1>
        <p className="flow-text">This page not yet complete...</p>
      </div>
    );
  }
}