import React, {DOM, PropTypes, Component, PureComponent} from "react";

export default class PageFooter extends PureComponent {
  render() {
    return (
      <footer className="page-footer" style={{padding: 0}}>
        <div className="footer-copyright indigo darken-2">
          <div className="container">
            © 2016 Moody Salem
          </div>
        </div>
      </footer>
    );
  }
}