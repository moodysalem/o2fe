import React, {DOM, PropTypes, Component, PureComponent} from "react";

export default class PageFooter extends PureComponent {
  render() {
    return (
      <footer className="page-footer" style={{padding: 0, marginTop: 0}}>
        <div className="footer-copyright black lighten-3">
          <div className="container">
            <span style={{marginRight: 4}}>© 2016</span>
            <a href="https://moodysalem.com" className="white-text" target="_blank" rel="noopener">
              Moody Salem
            </a>
          </div>
        </div>
      </footer>
    );
  }
}