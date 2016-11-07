import React, {PropTypes, PureComponent} from "react";
import ClientForm from "./ClientForm";
import FormModal from "./FormModal";

export default class ClientModal extends PureComponent {
  render() {
    return (
      <FormModal objectName="Client" objectForm={ClientForm} {...this.props}/>
    );
  }
}