import {browserHistory, Router, Route, IndexRoute, IndexRedirect, Redirect} from "react-router";
import React, {PropTypes, PureComponent} from "react";
import {NotFound, Home, Docs, Admin, Application} from "./pages/index";
import {CONFIG_SHAPE, TOKEN_SHAPE, NOTIFICATION_HANDLERS} from "./util/shapes";
import {getToken, saveToken, clearToken} from "./util/token";
import Preloader from "./pages/comps/Preloader";
import ContentWrapper from "./pages/comps/ContentWrapper";
import dao from "./util/dao";
import NotificationSystem from "react-notification-system";
import setTitle from "./util/setTitle";
import requireLogin from "./util/requireLogin";

const NOTIFICATION_DEFAULTS = {
  autoDismiss: 7,
  position: 'tc'
};

export default class App extends PureComponent {
  static propTypes = {
    config: CONFIG_SHAPE,
    tryToken: PropTypes.string
  };

  static defaultProps = {
    tryToken: null
  };

  state = {
    token: null,
    dao: new dao({config: this.props.config})
  };

  static childContextTypes = {
    token: TOKEN_SHAPE,
    config: CONFIG_SHAPE,
    dao: PropTypes.object.isRequired,
    onLogOut: PropTypes.func.isRequired,
    ...NOTIFICATION_HANDLERS
  };

  getChildContext() {
    const {config} = this.props;
    const {token, dao} = this.state;
    return {
      token,
      dao,
      config,
      onLogOut: this.logout,
      onError: this.error,
      onWarning: this.warning,
      onInfo: this.info,
      onSuccess: this.success
    };
  }

  error = (message, options) => this.msg(message, {...options, level: 'error'});
  success = (message, options) => this.msg(message, {...options, level: 'success'});
  warning = (message, options) => this.msg(message, {...options, level: 'warning'});
  info = (message, options) => this.msg(message, {...options, level: 'info'});
  msg = (message, options) => {
    if (message instanceof Error) {
      console.error(message);
      message = message.message;
    }
    this.refs.ns.addNotification({...NOTIFICATION_DEFAULTS, message, ...options});
  };

  logout = () => {
    const {dao} = this.state;

    clearToken();
    dao.forgetMe();

    this.setState({token: null, dao: dao.withToken(null)});
  };

  componentDidMount() {
    this.checkAccessToken(this.props.tryToken);
  }

  checkAccessToken(token) {
    const {dao} = this.state;

    dao.tokenInfo(token)
      .then(token => {
        // if that succeeded, use it
        if (token != null) {
          return token;
        } else {
          // otherwise try the stored token
          const storage = getToken();
          if (storage != null) {
            return dao.tokenInfo(storage.access_token);
          } else {
            return null;
          }
        }
      })
      .then(
        token => {
          saveToken(token);
          this.setState({token, dao: this.state.dao.withToken(token), loaded: true});
        }
      );
  }

  render() {
    const {loaded} = this.state;

    if (!loaded) {
      return (
        <div className="display-flex align-items-center justify-content-center"
             style={{width: '100vw', height: '100vh', padding: 30}}>
          <Preloader size="big"/>
        </div>
      );
    }

    return (
      <div>
        <Router history={browserHistory}>
          <Route path="/" component={ContentWrapper}>
            <IndexRoute component={Home} onEnter={e => setTitle('Home')}/>
            <Route path="docs" component={Docs} onEnter={e => setTitle('Docs')}/>
            <Route path="docs/:section" component={Docs} onEnter={e => setTitle('Docs')}/>
            <Route path="admin" component={requireLogin(Admin)} onEnter={e => setTitle('Admin')}/>
            <Route path="applications/:id" component={requireLogin(Application)} onEnter={e => setTitle('Application')}>
              <Route path="scopes" component={Application.Scopes} onEnter={e => setTitle('Scopes')}/>
              <Route path="clients" component={Application.Clients} onEnter={e => setTitle('Clients')}/>
              <Route path="users" component={Application.Users} onEnter={e => setTitle('Users')}/>
              <IndexRedirect to="scopes"/>
              <Redirect from="*" to="scopes"/>
            </Route>
            <Route path="*" component={NotFound} onEnter={e => setTitle('Not Found')}/>
          </Route>
        </Router>
        <NotificationSystem ref="ns"/>
      </div>
    );
  }
}