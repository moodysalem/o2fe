import React, {Component, PureComponent, PropTypes} from "react";
import {Link} from "react-router";
import cx from "classnames";
import join from "url-join";
import {CONFIG_SHAPE, TOKEN_SHAPE} from "../../util/constants";

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
    token: TOKEN_SHAPE,
    config: CONFIG_SHAPE.isRequired,
    onLogOut: PropTypes.func.isRequired
  };

  static defaultContext = {
    token: null
  };

  state = {
    open: false,
    adminOpen: false
  };

  componentWillReceiveProps({location:nextLocation}) {
    if (nextLocation.pathname != this.props.location.pathname) {
      this.setState({open: false, adminOpen: false});
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
      `&redirect_uri=${ORIGIN}`;
  }

  logout = (e) => {
    e.preventDefault();
    this.context.onLogOut();
  };

  toggleAdmin = (e) => {
    e.preventDefault();
    this.setState({adminOpen: !this.state.adminOpen});
  };

  render() {
    const {token} = this.context,
      {location} = this.props,
      {open, adminOpen} = this.state;

    const links = [
      <NavLink location={location} key="home" to="">Home</NavLink>,
      <li key="docs"><a target="_blank" href="https://docs.oauth2cloud.com">Docs</a>
      </li>,
      token != null ?
        <li key="admin" style={{position: 'relative'}}>
          <a className="dropdown-button" href="#!" onClick={this.toggleAdmin}>
            {token.user.email} <i className="fa fa-caret-down"/>
          </a>
          <ul className="dropdown-content"
              style={{
                width: 143,
                left: '50%',
                transform: 'translateX(-50%)',
                position: 'absolute',
                opacity: 1,
                display: adminOpen ? 'block' : 'none'
              }}>
            <NavLink location={location} key="apps" to="applications">Applications</NavLink>
            <li className="divider"/>
            <li><a href="#" onClick={this.logout}>Log Out</a></li>
          </ul>
        </li> :
        <li key="login"><a href={this.getLoginUrl()}>Log In</a></li>
    ];

    return (
      <nav className="indigo darken-2">
        <div className="nav-wrapper container">
          <a href="" className="brand-logo">
            <i className="fa fa-cloud hide-on-med-and-down" style={{float: 'none'}}/>
            OAuth2Cloud
          </a>
          <a className="button-collapse" onClick={this.open}>
            <i className="fa fa-bars" style={{cursor: 'pointer'}}/>
          </a>
          <ul className="right hide-on-med-and-down">
            {links}
          </ul>
          <div className="hide-on-large-only">
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
        </div>
      </nav>
    );
  }
}