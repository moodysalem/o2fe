var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');

var util = rbs.util;

var d = React.DOM;
var rpt = React.PropTypes;
var btn = rbs.components.controls.Button;

module.exports = util.rf({
  displayName: "Delete Button",

  getInitialState: function () {
    return {
      confirm: false
    };
  },

  cancel: function () {
    this.setState({
      confirm: false
    });
  },

  confirm: function () {
    this.setState({
      confirm: true
    });
  },

  getButtons: function () {
    if (this.state.confirm) {
      return [
        btn({
          key: "cancel",
          caption: "Cancel",
          size: "xs",
          ajax: true,
          onClick: this.cancel
        }),
        btn({
          key: "btn",
          type: "danger",
          caption: "Confirm",
          icon: "ban",
          size: "xs",
          ajax: true,
          onClick: _.bind(function () {
            this.props.model.destroy({ wait: true });
          }, this)
        })
      ];
    } else {
      return [
        btn({
          key: "btn",
          type: "danger",
          caption: "Delete",
          icon: "ban",
          size: "xs",
          ajax: true,
          onClick: this.confirm
        })
      ];
    }
  },

  render: function () {
    return d.div({ className: "text-center" }, d.div({ className: "btn-group" }, this.getButtons()));
  }
});