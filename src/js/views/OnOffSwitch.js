var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');

var util = rbs.util;

var d = React.DOM;
var rpt = React.PropTypes;

module.exports = util.rf({
  displayName: "On Off Switch",

  transformChangeEvent: function (e) {
    if (typeof this.props.onChange === "function") {
      var checked = Boolean(e.target.checked);
      this.props.onChange(checked);
    }
  },

  render: function () {
    var cn = [ 'onoffswitch-checkbox' ];
    if (this.props.className) {
      cn = _.without(cn.concat(this.props.className.split(" ")), 'form-control');
    }



    return d.div({ className: "onoffswitch" }, [
      d.input(_.omit(_.extend({}, this.props, {
        className: cn.join(" "),
        type: "checkbox",
        key: "input",
        checked: Boolean(this.props.value),
        onChange: this.transformChangeEvent
      }), "children", "value")),
      d.label({ className: "onoffswitch-label", key: "label", htmlFor: this.props.id })
    ]);
  }
});