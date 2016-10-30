import React, {PropTypes, PureComponent} from "react";
import cx from "classnames";

export default class Switch extends PureComponent {
  static propTypes = {
    switched: PropTypes.bool,
    onSwitch: PropTypes.func.isRequired
  };
  static defaultProps = {};

  render() {
    const {switched, onSwitch, disabled, className} = this.props;

    return (
      <div className={cx('switch', className)}>
        <label>
          Off
          <input type="checkbox" disabled={disabled}
                 checked={switched} onChange={e => onSwitch(e.target.checked)}/>
          <span className="lever"/>
          On
        </label>
      </div>
    );
  }
}