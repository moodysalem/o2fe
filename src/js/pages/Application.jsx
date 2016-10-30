import React, {DOM, PropTypes, Component, PureComponent} from "react";

export default class Application extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      section: PropTypes.oneOf(['clients', 'scopes', 'users']).isRequired
    }).isRequired
  };
  static defaultProps = {};

  componentDidMount() {
    this.loadData();
  }

  loadData() {

  }

  render() {
    return (
      <div className="container">
        <h1>WIP</h1>
        <p className="flow-text">This page not yet complete...</p>
      </div>
    );
  }
}