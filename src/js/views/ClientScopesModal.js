'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');
var lw = require('./Loading');
var alerts = rbs.components.collection.Alerts;
var mdls = require('../Models');
var btn = rbs.components.controls.Button;
var modal = rbs.components.layout.Modal;
var model = rbs.mixins.Model;
var alt = rbs.components.layout.Alert;
var util = rbs.util;

var d = React.DOM;
var rpt = React.PropTypes;

module.exports = util.rf({
  displayName: "Client Scopes Modal",

  propTypes: {
    // used for fetching the scopes that are currently assigned
    clientId: rpt.number.isRequired,
    // used for fetching the scopes that can be assigned
    applicationId: rpt.number.isRequired
  },

  getDefaultProps: function () {
    return {};
  },

  getInitialState: function () {
    return {
      clientScopes: new mdls.ClientScopes(),
      scopes: new mdls.Scopes()
    };
  },

  /**
   * When it opens, refresh the client scopes and scopes list
   */
  componentDidUpdate: function (prevProps) {
    if (!prevProps.open && this.props.open) {
      this.state.clientScopes.setParam("clientId", this.props.clientId);
      this.state.clientScopes.reset();
      this.state.clientScopes.fetch();

      this.state.scopes.setParam("applicationId", this.props.applicationId);
      this.state.scopes.reset();
      this.state.scopes.fetch();
    }
  },

  /**
   * Find a scope that isn't already used
   */
  findUnusedScope: function () {
    var unused = this.state.scopes.filter(function (scope) {
      return !this.state.clientScopes.some(function (cs) {
        return cs.get("scope.id") === scope.get("id");
      });
    }, this);
    if (unused.length > 0) {
      return unused[ 0 ].toJSON();
    } else {
      return null;
    }
  },

  render: function () {
    var mProps = _.extend({
      ref: "modal"
    }, this.props);
    return modal(mProps, [
      d.div({
        key: "mb",
        className: "modal-body"
      }, [
        lw({
          key: "tbl",
          watch: [ this.state.clientScopes, this.state.scopes ]
        }, rbs.components.collection.Div({
          collection: this.state.clientScopes,
          modelComponentProps: { scopes: this.state.scopes },
          modelComponent: require('./ClientScope'),
          emptyNode: alt({
            key: "at",
            icon: "info",
            level: "info",
            strong: "Info",
            message: "No scopes have been assigned to this client."
          })
        })),
        alerts({
          watch: this.state.clientScopes,
          key: "alts",
          showSuccess: false
        })
      ]),
      d.div({
        key: "mf",
        className: "modal-footer"
      }, [
        btn({
          key: "done",
          ajax: true,
          icon: "ban",
          onClick: this.props.onClose,
          caption: "Done"
        }),
        btn({
          key: "add",
          icon: "plus",
          ajax: true,
          type: "primary",
          caption: "Add",
          onClick: _.bind(function () {
            this.state.clientScopes.add({
              priority: "ASK",
              scope: this.findUnusedScope(),
              client: {
                id: this.props.clientId
              },
              approved: true
            });
          }, this)
        }),
        btn({
          key: "save",
          icon: "save",
          ajax: true,
          type: "success",
          onClick: _.bind(function () {
            this.state.clientScopes.save()
              .then(_.bind(function () {
                this.refs.modal.close();
              }, this));
          }, this),
          caption: "Save"
        })
      ])
    ]);
  }
});