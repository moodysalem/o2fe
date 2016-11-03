import React, {PropTypes, PureComponent} from "react";
import cx from "classnames";

export default class Switch extends PureComponent {
  static propTypes = {
    switched: PropTypes.bool,
    onSwitch: PropTypes.func.isRequired,
    onText: PropTypes.node,
    offText: PropTypes.node,
    id: PropTypes.string
  };
  static defaultProps = {
    onText: 'Yes',
    offText: 'No',
    id: null
  };

  render() {
    const {id, switched, onSwitch, disabled, className, offText, onText, ...rest} = this.props;

    return (
      <div className={cx('switch', className)} {...rest}>
        <label>
          {offText}
          <input id={id} type="checkbox" disabled={disabled}
                 checked={switched} onChange={e => onSwitch(e.target.checked)}/>
          <span className="lever"/>
          {onText}
        </label>
      </div>
    );
  }
}