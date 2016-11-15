import React, {PropTypes, PureComponent} from "react";

export default class MergeForm extends PureComponent {
  static contextTypes = {};
  static propTypes = {
    merging: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired
    })).isRequired
  };

  static defaultProps = {};

  render() {
    return (
      <form onSubmit={e => e.preventDefault()}>

      </form>
    );
  }
}