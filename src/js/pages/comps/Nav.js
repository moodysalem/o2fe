import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import cx from "classnames";
import join from "url-join";
import {CONFIG_SHAPE} from "../../constants";

class LinkContainer extends Component {
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

export default class Navbar extends Component {
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

  render() {
    const {user, config} = this.context,
      {location} = this.props,
      {open} = this.state;

    const {API_URL} = config;

    const links = [
      <LinkContainer location={location} key="home" to="">Home</LinkContainer>,
      <LinkContainer location={location} key="docs" to="docs">Docs</LinkContainer>,
      user != null ?
        <li key="admin"><Link to="admin">Admin</Link></li> :
        <li key="login"><a href={join(API_URL, 'authorize')}>Log In</a></li>
    ];

    return (
      <nav className="blue lighten-3">
        <div className="nav-wrapper" style={{paddingLeft: 8, paddingRight: 8}}>
          <a href="" className="brand-logo">OAuth2Cloud</a>
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