import React, {DOM, PropTypes, Component, PureComponent} from "react";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import {browserHistory, Router, Route, IndexRoute} from "react-router";
import {CONFIG_SHAPE, TOKEN_SHAPE} from "./util/constants";
import ProgressBar from "./pages/comps/ProgressBar";
import {readHash} from "./util/hash";
import ContentWrapper from "./pages/comps/ContentWrapper";
import DAO from "./util/DAO";

const TOKEN_KEY = 'o2fe_token';
const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY));
  } catch (err) {
    return null;
  }
};
const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
};
const removeToken = () => {
  localStorage.clear();
};

export default class App extends Component {
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
    const { config } = this.state;

    removeToken();
    DAO.logout(config);

    this.setState({token: null});
  };

  componentDidMount() {
    // get the config
    DAO.getConfig()
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
          return DAO.tokenInfo({config, accessToken: hash.access_token});
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
            return DAO.tokenInfo({config, accessToken: storage.access_token});
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
      <Router history={browserHistory}>
        <Route path="/" component={ContentWrapper}>
          <IndexRoute component={Home}/>
          <Route path="*" component={NotFound}/>
        </Route>
      </Router>
    );
  }
}