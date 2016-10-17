import React, {DOM, PropTypes, Component, PureComponent} from "react";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Nav from "./pages/comps/Nav";
import {browserHistory, Router, Route} from "react-router";

export default class App extends Component {
  static propTypes = {
    config: PropTypes.shape({
      API_URL: PropTypes.string
    }).isRequired
  };

  static defaultProps = {};

  state = {
    user: null
  };

  static childContextTypes = {
    user: PropTypes.object
  };

  getChildContext() {
    return this.state.user;
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="*" component={Nav}/>
        <Route path="/home" component={Home}/>
        <Route path="*" component={NotFound}/>
      </Router>
    );
  }
}