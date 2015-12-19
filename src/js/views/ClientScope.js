var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');

var util = rbs.util;
var mdls = require('../Models');

var d = React.DOM;
var rpt = React.PropTypes;

var gr = rbs.components.model.GridRow;

var delBtn = require('./DeleteButton');

module.exports = util.rf({
  displayName: "Client Scope",

  propTypes: {
    scopes: rpt.object.isRequired
  },

  mixins: [ rbs.mixins.Model ],

  render: function () {
    return d.div({
      className: "client-scope"
    }, [
      gr({
        key: "grid",
        model: this.props.model,
        attributes: [
          {
            attribute: "scope",
            searchOn: "name",
            label: "Scope",
            component: "select",
            className: "form-control input-sm",
            collection: this.props.scopes,
            modelComponent: rbs.components.model.SimpleOption,
            sm: 8
          },
          {
            attribute: "priority",
            valueAttribute: "name",
            searchOn: "name",
            label: "Priority",
            component: "select",
            className: "form-control input-sm",
            collection: mdls.ClientScopePriorities,
            modelComponent: rbs.components.model.SimpleOption,
            sm: 4
          }
        ]
      }),

      gr({
        key: "ot",
        model: this.props.model,
        attributes: [
          {
            attribute: "reason",
            label: "Reason",
            component: "textarea",
            className: "form-control input-sm",
            placeholder: "Reason for scope",
            xs: 6
          },
          {
            attribute: "approved",
            label: "Approved",
            component: "checkbox",
            xs: 2
          },
          {
            component: delBtn,
            xs: 4
          }
        ]
      })
    ]);
  }
});