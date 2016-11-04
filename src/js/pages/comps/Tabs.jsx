import React, {PropTypes, PureComponent} from "react";

const Tab = ({}) => (
  <li className="tab col s3"><a href="#test1">Test 1</a></li>
);

export default class Tabs extends PureComponent {
  static propTypes = {};
  static defaultProps = {};

  render() {
    return (
      <ul className="tabs">
        <li className="tab col s3"><a href="#test1">Test 1</a></li>
        <li className="tab col s3"><a className="active" href="#test2">Test 2</a></li>
        <li className="tab col s3 disabled"><a href="#test3">Disabled Tab</a></li>
        <li className="tab col s3"><a href="#test4">Test 4</a></li>
      </ul>
    );
  }
}