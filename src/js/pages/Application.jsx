import React, {PropTypes, Children, PureComponent, cloneElement} from "react";
import {PAGE_LOADING} from "./comps/Preloader";
import {Link} from "react-router";
import Clients from "./sub/Clients";
import Scopes from "./sub/Scopes";
import Users from "./sub/Users";

export default class Application extends PureComponent {
  static Clients = Clients;
  static Scopes = Scopes;
  static Users = Users;

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
      return PAGE_LOADING;
    }

    const {name} = application;

    return (
      <div className="container">
        <div className="display-flex align-items-center flex-wrap-wrap justify-content-flex-end">
          <h1 className="flex-grow-1 truncate">{name}</h1>
          <div className="flex-shrink-0">
            <Link className="btn blue-grey darken-3" to="admin">
              <i className="fa fa-arrow-left"/> Back
            </Link>
          </div>
        </div>
        {
          children ? cloneElement(Children.only(children), {application}) : null
        }
      </div>
    );
  }
}