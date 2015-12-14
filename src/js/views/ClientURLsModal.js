'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');
var $ = require('jquery');
var model = rbs.mixins.Model;
var modal = rbs.components.layout.Modal;
var btn = rbs.components.controls.Button;
var alert = rbs.components.layout.Alert;

var util = rbs.util;

var d = React.DOM;
var rpt = React.PropTypes;

var HAS_URLS = [ "CODE", "IMPLICIT" ];
var AUTHORIZE_URL = util.path(config.API_URL, "oauth", "authorize");

module.exports = util.rf({
  mixins: [ model ],

  getUrls: function () {
    var flows = _.intersection(this.state.model.flows, HAS_URLS);
    if (flows.length === 0) {
      return alert({
        key: "alt",
        level: "info",
        icon: "info",
        strong: "Info",
        message: "This client does not have access to authorization flows that provide a login screen."
      });
    }
    var uris = this.state.model.uris;
    var cid = this.state.model.identifier;
    return _.map(flows, function (oneF) {
      return d.div({ className: "form-group", key: oneF }, [
        d.h4({ key: "header" }, [ oneF, " Flow URL" ]),
        d.div({ key: "uris" },
          _.map(uris, function (uri) {
            var params = {
              redirect_uri: uri,
              response_type: oneF === "CODE" ? "code" : "token",
              client_id: cid
            };

            return d.div({
              key: "input-" + uri,
              className: "form-group"
            }, [
              d.label({ key: "label" }, uri),
              d.input({
                key: "input",
                value: AUTHORIZE_URL + "?" + $.param(params),
                type: "text",
                className: "form-control",
                readOnly: true
              })
            ]);
          }, this)
        )
      ]);
    }, this);
  },

  render: function () {
    return modal(_.extend({}, this.props), [
      d.div({ className: "modal-body", key: "mb" }, [
        this.getUrls()
      ]),
      d.div({ className: "modal-footer", key: "mf" }, [
        btn({
          key: "close",
          caption: "Done",
          onClick: this.props.onClose
        })
      ])
    ]);
  }
});