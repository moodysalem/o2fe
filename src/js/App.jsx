import {browserHistory, Router, Route, IndexRoute} from "react-router";
import React, {PropTypes, PureComponent} from "react";
import {NotFound, Home,Docs} from "./pages/index";
import {CONFIG_SHAPE, TOKEN_SHAPE} from "./util/shapes";
import {getToken, saveToken, clearToken} from "./util/token";
import ProgressBar from "./pages/comps/ProgressBar";
import ContentWrapper from "./pages/comps/ContentWrapper";
import dao from "./util/dao";

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
    onLogOut: PropTypes.func.isRequired
  };

  getChildContext() {
    const {config} = this.props;
    const {token, dao} = this.state;
    return {token, dao, config, onLogOut: this.logout};
  }

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
      <Router history={browserHistory}>
        <Route path="/" component={ContentWrapper}>
          <IndexRoute component={Home}/>
          <Route path="docs" component={Docs}/>
          <Route path="*" component={NotFound}/>
        </Route>
      </Router>
    );
  }
}