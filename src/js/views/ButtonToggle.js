var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');

var util = rbs.util;

var d = React.DOM;
var rpt = React.PropTypes;

module.exports = util.rf({
  displayName: "Button Toggle",

  mixins: [ rbs.mixins.Collection ],

  selectOption: function (model) {
    this.props.onChange(model.get("name"));
  },

  wrapperFunction: function (comp, model, index) {
    var type = 'default';
    if (this.props.value === model.get("name")) {
      type = 'primary';
    }
    return rbs.components.controls.Button({
      caption: comp,
      type: type,
      key: 'model-' + model.cid,
      onClick: _.bind(this.selectOption, this, model)
    });
  },

  render: function () {
    return d.div({}, d.div({ className: "btn-group" }, this.getModels()));
  }
});