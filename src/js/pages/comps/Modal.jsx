import React, {PropTypes, PureComponent} from "react";
import cx from "classnames";
import {Fade, SlideDown} from "../comps/Animations";

const Footer = ({children, className, ...rest}) => (
  <div className={cx('modal-footer', className)} {...rest}>{children}</div>
);

const Content = ({children, className, ...rest}) => (
  <div className={cx('modal-content', className)} {...rest}>{children}</div>
);

const Action = ({children, disabled, onClick, ...rest}) => (
  <a className={cx('modal-action waves-effect waves-green btn-flat', {disabled})} onClick={e => {
    if (!disabled) {
      onClick(e);
    }
  }} {...rest}>{children}</a>
);

const BACKDROP_STYLE = {
  position: 'fixed',
  zIndex: 1000,
  top: -100,
  left: 0,
  bottom: 0,
  right: 0,
  height: '125%',
  width: '100%',
  background: 'black',
  display: 'block',
  opacity: 0.5
};

const BACKDROP = <div className="modal-overlay" style={BACKDROP_STYLE}/>;

export default class Modal extends PureComponent {
  static Footer = Footer;
  static Action = Action;
  static Content = Content;

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fixedFooter: PropTypes.bool
  };
  static defaultProps = {};

  componentDidUpdate({open:prevOpen}) {
    if (this.props.open && !prevOpen) {
      this.refs._modal.focus();
    }
  }

  closeOnEscape = (e) => {
    if (e.keyCode === 27) {
      this.props.onClose();
    }
  };

  render() {
    const {className, children, open, style, fixedFooter, onClose, ...rest} = this.props;

    return (
      <div onKeyDown={this.closeOnEscape} ref="_modal" tabIndex="-1">
        <Fade>
          {
            open ? <div style={{zIndex: 1000, position: 'fixed'}}>{BACKDROP}</div> : null
          }
        </Fade>

        <SlideDown>
          {
            open ? (
              <div className={cx('modal', {'modal-fixed-footer': fixedFooter}, className)}
                   style={{...style, top: '10%', zIndex: 1001, display: 'block'}} {...rest}>
                {children}
              </div>
            ) : null
          }
        </SlideDown>
      </div>
    );
  }
}