import {browserHistory, Router, Route, IndexRoute} from "react-router";
import React, {PropTypes, PureComponent} from "react";
import {NotFound, Home, Docs, Admin, Application} from "./pages/index";
import {CONFIG_SHAPE, TOKEN_SHAPE} from "./util/shapes";
import {getToken, saveToken, clearToken} from "./util/token";
import ProgressBar from "./pages/comps/ProgressBar";
import ContentWrapper from "./pages/comps/ContentWrapper";
import dao from "./util/dao";
import NotificationSystem from "react-notification-system";

const windowTitle = document.title || 'OAuth2Cloud';
function setTitle(title = null) {
  if (!title) {
    document.title = windowTitle;
  } else {
    document.title = `${title} | ${windowTitle}`;
  }
}
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
    onError: PropTypes.func.isRequired,
    onInfo: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onWarning: PropTypes.func.isRequired
  };

  getChildContext() {
    const {config} = this.props;
    const {token, dao} = this.state;
    return {
      token, dao, config,
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
      message = message.message;
    }
    this.refs.ns.addNotification({message, ...options});
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
        <div className="container">
          <ProgressBar/>
        </div>
      );
    }

    return (
      <div>
        <Router history={browserHistory}>
          <Route path="/" component={ContentWrapper}>
            <IndexRoute component={Home} onEnter={e => setTitle('Home')}/>
            <Route path="docs" component={Docs} onEnter={e => setTitle('Docs')}/>
            <Route path="admin" component={Admin} onEnter={e => setTitle('Admin')}/>
            <Route path="applications/:id/:section" component={Application} onEnter={e => setTitle('Application')}/>
            <Route path="*" component={NotFound} onEnter={e => setTitle('Not Found')}/>
          </Route>
        </Router>
        <NotificationSystem ref="ns"/>
      </div>
    );
  }
}