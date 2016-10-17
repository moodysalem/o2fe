import React, {DOM, PropTypes, Component, PureComponent} from "react";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Nav from "./pages/comps/Nav";
import Docs from "./pages/Docs";
import {browserHistory, Router, Route, IndexRoute} from "react-router";
import {CONFIG_SHAPE} from "./constants";
import PageFooter from "./pages/comps/PageFooter";

const NavWrapper = ({children, ...rest}) => {
  return (
    <div className="display-flex flex-direction-column" style={{minHeight: '100vh'}}>
      <Nav {...rest}/>
      <main className="flex-grow-1">
        {children}
      </main>
      <PageFooter/>
    </div>
  );
};

export default class App extends Component {
  static propTypes = {
    config: CONFIG_SHAPE
  };

  static defaultProps = {};

  state = {
    token: null
  };

  static childContextTypes = {
    token: PropTypes.object,
    config: CONFIG_SHAPE
  };

  getChildContext() {
    const {token} = this.state;
    const {config} = this.props;
    return {token, config};
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={NavWrapper}>
          <IndexRoute component={Home}/>
          <Route path="/docs" component={Docs}/>
          <Route path="*" component={NotFound}/>
        </Route>
      </Router>
    );
  }
}