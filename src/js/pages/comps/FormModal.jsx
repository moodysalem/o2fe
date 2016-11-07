import React, {createElement, PropTypes, PureComponent} from "react";
import Modal from "./Modal";
import {findDOMNode} from "react-dom";

export default class FormModal extends PureComponent {
  static propTypes = {
    value: PropTypes.object,
    objectName: PropTypes.string.isRequired,
    objectForm: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: null
  };

  render() {
    const {value, objectForm, objectName, onSave, onChange, onClose, ...rest} = this.props;

    return (
      <Modal {...rest} fixedFooter={true} onClose={onClose} open={value != null}>
        <Modal.Content>
          <h4>{value != null && value.id ? 'Edit' : 'Create'} {objectName}</h4>
          {
            value != null ? createElement(objectForm, {value, onChange}) : null
          }
        </Modal.Content>
        <Modal.Footer>
          <Modal.Action onClick={onSave}>Save</Modal.Action>
          <Modal.Action onClick={onClose}>Cancel</Modal.Action>
        </Modal.Footer>
      </Modal>
    );
  }
}