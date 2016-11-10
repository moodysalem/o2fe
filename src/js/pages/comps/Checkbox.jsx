import React, {PropTypes, PureComponent} from "react";

export default class Checkbox extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['filled-in', 'filled-in-box']),
    label: PropTypes.node
  };

  static defaultProps = {
    type: 'filled-in-box',
    label: null
  };

  state = {
    id: Math.random().toString(36).substring(7)
  };

  render() {
    const {type, label, ...rest} = this.props;
    const {id} = this.state;

    return (
      <p>
        <input id={id} type="checkbox" className={type} {...rest}/>
        <label htmlFor={id}>{label}</label>
      </p>
    );
  }
}