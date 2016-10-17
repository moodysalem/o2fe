import React, {DOM, PropTypes, Component, PureComponent} from "react";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Docs from "./pages/Docs";
import {browserHistory, Router, Route, IndexRoute} from "react-router";
import {CONFIG_SHAPE, TOKEN_SHAPE} from "./util/constants";
import ProgressBar from "./pages/comps/ProgressBar";
import {readHash} from "./util/hash-util";
import ContentWrapper from "./pages/comps/ContentWrapper";
import DAO from "./util/DAO";

export default class App extends Component {
  state = {
    token: null,
    config: null,
    loaded: false
  };

  static childContextTypes = {
    token: TOKEN_SHAPE,
    config: CONFIG_SHAPE
  };

  getChildContext() {
    const {token, config} = this.state;
    return {token, config};
  }


  componentDidMount() {
    DAO.getConfig()
      .then(config => {
        this.setState({config});
        return DAO.loadToken({config, hash: readHash()});
      })
      .then(token => {
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
          <Route path="/docs" component={Docs}/>
          <Route path="*" component={NotFound}/>
        </Route>
      </Router>
    );
  }
}