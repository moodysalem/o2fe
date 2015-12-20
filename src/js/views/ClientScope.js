var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');

var util = rbs.util;
var mdls = require('../Models');

var d = React.DOM;
var rpt = React.PropTypes;

var gr = rbs.components.model.GridRow;

var opt = util.rf({
  displayName: "Option",
  mixins: [ rbs.mixins.Model ],
  render: function () {
    return d.div({}, this.state.model.name);
  }
});

module.exports = util.rf({
  displayName: "Client Scope",

  propTypes: {
    scopes: rpt.object.isRequired
  },

  mixins: [ rbs.mixins.Model ],

  render: function () {
    var m = this.state.model;


    return d.div({
      className: "client-scope"
    }, [
      d.div({ className: "row", key: "r" }, [
        // left side
        d.div({ className: "col-sm-10", key: "1" }, [
          gr({
            key: "grid",
            model: this.props.model,
            attributes: [
              m.id ? {
                attribute: "scope.name",
                label: "Scope",
                component: d.span,
                tip: "The name of the scope.",
                sm: 8
              } : {
                attribute: "scope",
                searchOn: "name",
                label: "Scope",
                component: "select",
                tip: "The name of the scope.",
                className: "form-control input-sm",
                collection: this.props.scopes,
                modelComponent: opt,
                sm: 8
              },
              {
                attribute: "priority",
                valueAttribute: "name",
                searchOn: "name",
                label: "Priority",
                tip: "Whether the scope is optional to log in, required to log in, or is even displayed to the user.",
                component: "select",
                className: "form-control input-sm",
                collection: mdls.ClientScopePriorities,
                modelComponent: opt,
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
                tip: "Enter a plain text reason that is displayed to the user that the client needs this scope.",
                placeholder: "Reason for scope",
                xs: 12
              }
            ]
          })
        ]),

        // right side
        d.div({ className: "col-sm-2", key: "2" }, [
          gr({
            key: "switch",
            model: this.props.model,
            attributes: [
              {
                tip: "Whether this client currently has access to this scope.",
                attribute: "approved",
                label: "Approved",
                component: require('./OnOffSwitch'),
                xs: 12
              }
            ]
          })
        ])
      ])

    ]);
  }
});