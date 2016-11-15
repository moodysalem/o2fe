import React, {Component, PureComponent, PropTypes} from "react";
import {Link} from "react-router";
import cx from "classnames";
import join from "url-join";
import {CONFIG_SHAPE, TOKEN_SHAPE} from "../../util/shapes";
import getLoginUrl from "../../util/getLoginUrl";

class NavLink extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const {to, children, icon, className, location, ...rest} = this.props;
    const {pathname} = location;

    return (
      <li {...rest} className={cx(className, {'active': join('', pathname) == join('', to)})}>
        <Link to={to}>
          <span>
            {icon ? <i className={`fa fa-${icon}`}/> : null} {children}
          </span>
        </Link>
      </li>
    );
  }
}

const BACKDROP_STYLE = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.2)'
};

const DROPDOWN_STYLE = {
  width: 143,
  left: '50%',
  transform: 'translateX(-50%)',
  position: 'absolute',
  opacity: 1
};

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
  close = () => this.setState({open: false, adminOpen: false});

  logout = (e) => {
    e.preventDefault();
    this.context.onLogOut();
  };

  toggleAdmin = (e) => {
    e.preventDefault();
    this.setState({adminOpen: !this.state.adminOpen});
  };

  render() {
    const {token, config} = this.context,
      {location} = this.props,
      {open, adminOpen} = this.state;

    const links = [
      <NavLink icon="home" onClick={this.close} location={location} key="home" to="">Home</NavLink>,
      <NavLink icon="book" onClick={this.close} location={location} key="docs" to="docs">Docs</NavLink>,
      <NavLink icon="dollar" onClick={this.close} location={location} key="pricing" to="pricing">Pricing</NavLink>,
      token != null ?
        <li key="admin" style={{position: 'relative'}}>
          <a className="dropdown-button" href="#!" onClick={this.toggleAdmin}>
            <span>{token.user.email} <i className="fa fa-caret-down"/></span>
          </a>
          <ul className="dropdown-content"
              style={{
                ...DROPDOWN_STYLE,
                display: adminOpen ? 'block' : 'none'
              }}>
            <NavLink onClick={this.close} location={location} key="apps" to="admin">
              My Apps
            </NavLink>
            <li onClick={this.close}>
              <a href="#" onClick={this.logout}>Log Out</a>
            </li>
          </ul>
        </li> :
        <li key="login">
          <a href={getLoginUrl(config)}>
            <span><i className="fa fa-sign-in"/>  Log In</span>
          </a>
        </li>
    ];

    return (
      <nav className="blue-grey darken-4">
        <div className="nav-wrapper container">
          <a href="" className="brand-logo" title={__VERSION__}>
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
              open ? <div style={BACKDROP_STYLE} onClick={this.close}></div> : null
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