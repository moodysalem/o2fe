'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var modal = rbs.components.layout.Modal;
var alert = rbs.components.layout.Alert;
var btn = rbs.components.controls.Button;
var _ = require('underscore');
var util = rbs.util;

var d = React.DOM;
var rpt = React.PropTypes;

module.exports = util.rf({
  displayName: "delete modal",

  propTypes: {
    deleteMessage: rpt.string.isRequired,
    onDelete: rpt.func.isRequired
  },

  render: function () {
    return modal(_.extend({
      title: "Confirm Delete",
      body: alert({
        key: "warning",
        strong: "Warning",
        message: this.props.deleteMessage,
        level: "danger",
        icon: "exclamation-triangle"
      }),
      footer: [
        btn({
          key: "cancel",
          ajax: true,
          icon: "cancel",
          onClick: this.props.onClose,
          caption: "Cancel"
        }),
        btn({
          key: "del",
          icon: "trash",
          ajax: true,
          type: "danger",
          onClick: this.props.onDelete,
          caption: "Delete"
        })
      ]
    }, this.props));
  }
});