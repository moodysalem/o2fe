import React, {Component, PureComponent, PropTypes} from "react";
import {Link} from "react-router";
import cx from "classnames";
import join from "url-join";
import {CONFIG_SHAPE} from "../../util/constants";

class NavLink extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const {to, children, className, location, ...rest} = this.props;
    const {pathname} = location;

    return (
      <li {...rest} className={cx(className, {'active': join('', pathname) == join('', to)})}>
        <Link to={to}>{children}</Link>
      </li>
    );
  }
}

const ORIGIN = window.location.origin;

export default class Navbar extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired
  };

  static contextTypes = {
    user: PropTypes.object,
    config: CONFIG_SHAPE
  };

  static defaultContext = {
    user: null
  };

  state = {
    open: false
  };

  componentWillReceiveProps({location:nextLocation}) {
    if (nextLocation.pathname != this.props.location.pathname) {
      this.close();
    }
  }

  open = () => this.setState({open: true});
  close = () => this.setState({open: false});

  getLoginUrl() {
    const {config} = this.context;
    const {API_URL, CLIENT_ID} = config;

    return `${join(API_URL, 'authorize')}` +
      `?client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&response_type=token` +
      `&redirect_uri=${join(ORIGIN, 'login')}`;
  }

  render() {
    const {user} = this.context,
      {location} = this.props,
      {open} = this.state;

    const links = [
      <NavLink location={location} key="home" to="">Home</NavLink>,
      <NavLink location={location} key="docs" to="docs">Docs</NavLink>,
      user != null ?
        <li key="admin"><Link to="admin">Admin</Link></li> :
        <li key="login"><a href={this.getLoginUrl()}>Log In</a></li>
    ];

    return (
      <nav className="indigo darken-2">
        <div className="nav-wrapper container">
          <a href="" className="brand-logo">
            <i className="fa fa-cloud" style={{float: 'none'}}/>
            OAuth2Cloud
          </a>
          <a className="button-collapse" onClick={this.open}>
            <i className="fa fa-bars" style={{cursor: 'pointer'}}/>
          </a>
          <ul className="right hide-on-med-and-down">
            {links}
          </ul>
          {
            open ? <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.2)'
            }} onClick={this.close}></div> : null
          }
          <ul className="side-nav" style={{transform: `translateX(${open ? 0 : '-100%'})`}}>
            {links}
          </ul>
        </div>
      </nav>
    );
  }
}