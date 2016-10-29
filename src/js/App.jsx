import {hashHistory, Router, Route, IndexRoute} from "react-router";
import React, {DOM, PropTypes, PureComponent} from "react";
import {NotFound, Home} from "./pages/index";
import getConfig from './util/getConfig';
import {CONFIG_SHAPE, TOKEN_SHAPE} from "./util/shapes";
import {getToken, saveToken, removeToken} from "./util/token";
import ProgressBar from "./pages/comps/ProgressBar";
import {readHash} from "./util/hash";
import ContentWrapper from "./pages/comps/ContentWrapper";
import dao from "./util/dao";

export default class App extends PureComponent {
  state = {
    token: null,
    config: null,
    loaded: false
  };

  static childContextTypes = {
    token: TOKEN_SHAPE,
    config: CONFIG_SHAPE,
    onLogOut: PropTypes.func.isRequired
  };

  getChildContext() {
    const {token, config} = this.state;
    return {token, config, onLogOut: this.logout};
  }

  logout = () => {
    const {config} = this.state;

    removeToken();
    dao.logout(config);

    this.setState({token: null});
  };

  componentDidMount() {
    // get the config
    getConfig()
    // put it in state
      .then(config => {
        return new Promise((resolve, reject) => {
          this.setState({config}, () => resolve());
        });
      })
      // get the token out of the URL
      .then(() => {
        const {config} = this.state,
          hash = readHash();

        // if there is a hash, check it
        if (hash && hash.access_token) {
          return dao.tokenInfo({config, accessToken: hash.access_token});
        } else {
          return null;
        }
      })
      .then(token => {
        const {config} =this.state;
        // if that succeeded, use it
        // otherwise check localStorage
        if (token != null) {
          return token;
        } else {
          const storage = getToken();
          if (storage != null) {
            return dao.tokenInfo({config, accessToken: storage.access_token});
          } else {
            return null;
          }
        }
      })
      .then(token => {
        // we have the final token
        saveToken(token);
        this.setState({token, loaded: true});
      });
  }

  render() {
    const {loaded, config} = this.state;

    if (!loaded) {
      return (
        <div className="container">
          <ProgressBar/>
        </div>
      );
    }

    if (!config) {
      return (
        <div>Failed to load config!</div>
      );
    }

    return (
      <Router history={hashHistory}>
        <Route path="/" component={ContentWrapper}>
          <IndexRoute component={Home}/>
          <Route path="*" component={NotFound}/>
        </Route>
      </Router>
    );
  }
}