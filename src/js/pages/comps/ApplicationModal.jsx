import React, {PropTypes, PureComponent} from "react";
import ApplicationForm from "./ApplicationForm";
import FormModal from "./FormModal";

export default class ApplicationModal extends PureComponent {
  render() {
    return (
      <FormModal {...this.props} objectForm={ApplicationForm} objectName="Application"/>
    );
  }
}