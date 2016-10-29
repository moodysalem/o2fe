import React, {DOM, PropTypes, Component, PureComponent} from "react";
import PageFooter from "./PageFooter";
import Nav from "./Nav";

export default class ContentWrapper extends PureComponent {
  render() {
    const {children, ...rest} = this.props;

    return (
      <div className="display-flex flex-direction-column" style={{minHeight: '100vh'}}>
        <Nav {...rest}/>
        <main className="flex-grow-1">
          {children}
        </main>
        <PageFooter/>
      </div>
    );
  }
}