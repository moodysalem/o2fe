import React, {PropTypes, PureComponent} from "react";
import Modal from "./Modal";
export default class ConfirmActionModal extends PureComponent {
  static propTypes = {
    action: PropTypes.node,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    typeConfirm: PropTypes.string
  };

  static defaultProps = {
    action: null,
    typeConfirm: null
  };

  state = {confirm: ''};

  componentWillReceiveProps({open: nextOpen}) {
    if (!this.props.open && nextOpen) {
      this.setState({confirm: ''});
    }
  }

  handleConfirm = () => {
    const {onConfirm, typeConfirm} = this.props;

    if (typeConfirm == null || typeConfirm == this.state.confirm) {
      onConfirm();
    }
  };

  handleEnter = e => {
    if (e.keyCode == 13) {
      this.handleConfirm();
    }
  };

  render() {
    const {onClose, action, typeConfirm, onConfirm, ...rest} = this.props;
    const {confirm} = this.state;

    return (
      <Modal onClose={onClose} {...rest}>
        <Modal.Content>
          <h4>{action}</h4>
          {
            typeConfirm ? (
              <div>
                <p className="flow-text">Type the following to continue: <em>{typeConfirm}</em></p>
                <input type="text" value={confirm} onChange={e => this.setState({confirm: e.target.value})}
                       onKeyDown={this.handleEnter}/>
              </div>
            ) : null
          }
        </Modal.Content>
        <Modal.Footer>
          <Modal.Action disabled={typeConfirm != null && typeConfirm != confirm}
                        onClick={this.handleConfirm}>Continue</Modal.Action>
          <Modal.Action onClick={onClose}>Cancel</Modal.Action>
        </Modal.Footer>
      </Modal>
    );
  }
}