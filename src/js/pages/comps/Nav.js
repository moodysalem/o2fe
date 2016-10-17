import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
export default class Navbar extends Component {
  static contextTypes = {
    user: PropTypes.object
  };

  static defaultContext = {
    user: null
  };

  state = {
    open: false
  };

  open = () => this.setState({open: true});

  render() {
    const {user} = this.context;

    const links = [
      <li><Link to="/">Home</Link></li>,
      <li><Link to="docs">Docs</Link></li>,
      user != null ?
        <li><Link to="admin">Admin</Link></li> :
        <li><a href="">Log In</a></li>
    ];

    return (
      <nav>
        <div className="nav-wrapper" style={{paddingLeft: 8, paddingRight: 8}}>
          <a href={window.location.origin} className="brand-logo">OAuth2Cloud</a>
          <a className="button-collapse" onClick={this.open}>
            <i className="fa fa-bars" style={{cursor: 'pointer'}}/>
          </a>
          <ul className="right hide-on-med-and-down">
            {links}
          </ul>
          <ul className="side-nav">
            {links}
          </ul>
        </div>
      </nav>
    );
  }
}