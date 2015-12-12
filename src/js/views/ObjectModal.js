define(function(require, exports, module){
  'use strict';
  var React = require('react');
  var rbs = require('react-backstrap');
  var modal = rbs.components.layout.Modal;
  var btn = rbs.components.controls.Button;
        var util = rbs.util;
    var d = React.DOM;

    module.exports = util.rf({
      render: function () {
        var title = this.props.title;
        return modal(_.extend({
          title: title,
          open: this.props.open,
          onClose: this.props.onClose
        }, this.props), []);
      }
    });
  });