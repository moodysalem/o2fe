import React, {PropTypes, PureComponent} from "react";
import ApplicationForm from "./ApplicationForm";
import Modal from "./Modal";

export default class ApplicationModal extends PureComponent {
  render() {
    const {application, open, onSave, onChange, onClose, ...rest} = this.props;

    return (
      <Modal fixedFooter={true} onClose={onClose} open={open} {...rest}>
        <Modal.Content>
          <h4>{application != null && application.id ? 'Edit Application' : 'Create Application'}</h4>
          {
            open ? (
              <ApplicationForm onSubmit={onSave} value={application} onChange={onChange}/>
            ) : null
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