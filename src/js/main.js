require('../css/main.css');

import App from './appcomponent';
import request from 'superagent';
import {browserHistory, Router, Route} from 'react-router';
import home from './pages/home';
import nomatch from './pages/nomatch';
import navbar from './nav';

const rpt = React.PropTypes;

class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="*" component={navbar}/>
        <Route path="/home" component={home}/>
        <Route path="*" component={nomatch}/>
      </Router>
    );
  }
}

App.propTypes = {
  config: rpt.shape({
    API_URL: rpt.string
  }).isRequired
};

request.get('/config.json').end(function (err, res) {
  ReactDOM.render(<App config={res.body} history={history}></App>, document.getElementById('app'));
});
