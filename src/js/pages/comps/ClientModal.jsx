import React, {PropTypes, PureComponent} from "react";
import ClientForm from "./ClientForm";
import Modal from "./Modal";

export default class ClientModal extends PureComponent {
  render() {
    const {client, open, onSave, onChange, onClose, ...rest} = this.props;

    return (
      <Modal fixedFooter={true} onClose={onClose} open={open} {...rest}>
        <Modal.Content>
          <h4>{client != null && client.id ? 'Edit Client' : 'Create Client'}</h4>
          {
            open ? (
              <ClientForm onSubmit={onSave} value={client} onChange={onChange}/>
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