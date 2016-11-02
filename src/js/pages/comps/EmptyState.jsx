import React, {PropTypes, PureComponent} from "react";

const CENTER_STYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)'
};

export default class EmptyState extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    iconSize: PropTypes.any,
    minHeight: PropTypes.any
  };

  static defaultProps = {
    icon: 'book',
    iconSize: 120,
    minHeight: 300
  };

  render() {
    const {icon, minHeight, iconSize, children, style} = this.props;

    return (
      <div style={{position: 'relative', minHeight}}>
        <i className={`fa fa-${icon}`}
           style={{
             ...CENTER_STYLE,
             opacity: 0.1,
             fontSize: iconSize
           }}/>
        <div style={{...CENTER_STYLE, fontSize: 20, ...style}}>
          {children}
        </div>
      </div>
    );
  }
}