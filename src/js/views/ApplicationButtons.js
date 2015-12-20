var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');

var util = rbs.util;

var d = React.DOM;
var rpt = React.PropTypes;
var btn = rbs.components.controls.Button;


module.exports = util.rf({
  displayName: "Application Buttons",

  mixins: [ rbs.mixins.Model ],

  render: function () {
    return d.div({ className: "btn-container" }, [
      btn({
        key: "edit",
        size: "xs",
        type: "warning",
        caption: "Edit",
        icon: "pencil",
        href: util.path("applications", this.state.model.id)
      }),
      btn({
        key: "mc",
        size: "xs",
        caption: "Clients",
        icon: "sitemap",
        href: util.path("applications", this.state.model.id, "clients")
      }),
      btn({
        key: "u",
        size: "xs",
        type: "info",
        caption: "Users",
        icon: "users",
        href: util.path("applications", this.state.model.id, "users")
      }),
      btn({
        key: "scp",
        size: "xs",
        type: "primary",
        caption: "Scopes",
        icon: "book",
        href: util.path("applications", this.state.model.id, "scopes")
      })
    ])
  }
});