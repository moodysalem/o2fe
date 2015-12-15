'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var fm = rbs.components.model.Form;
var mdls = require('../Models');
var model = rbs.mixins.Model;
var btn = rbs.components.controls.Button;
var multitext = require('./MultiText');
var vp = require('./ViewablePassword');

var gr = rbs.components.model.GridRow;

var util = rbs.util;

var d = React.DOM;
var rpt = React.PropTypes;

var nameOpt = util.rf({
  mixins: [ model ],
  render: function () {
    return d.span({}, this.state.model.name);
  }
});

var row1 = [
  {
    attribute: "name",
    placeholder: "Name",
    required: true,
    label: "Name",
    component: "text",
    tip: "The name as users should see this client.",
    xs: 12
  }
];
var row2 = [
  {
    attribute: "tokenTtl",
    placeholder: "Access Token Time-To-Live",
    required: true,
    min: 0,
    label: "Token TTL",
    component: "number",
    tip: "Enter how long an access or client token should last before expiring in seconds from issue time.",
    sm: 6
  },
  {
    attribute: "refreshTokenTtl",
    placeholder: "Refresh Token Time-To-Live",
    label: "Refresh Token TTL",
    min: 0,
    component: "number",
    tip: "Enter how long a refresh token should last before expiring in seconds from issue time. Leave blank if this client should not receive refresh tokens.",
    sm: 6
  }
];


var lastrows = [
  {
    tip: "Type as defined by the OAuth2 specification. This controls whether client credentials are required for some of the token requests.",
    required: true,
    label: "Type",
    attribute: "type",
    searchOn: "name",
    valueAttribute: "name",
    component: "select",
    collection: mdls.ClientTypes,
    modelComponent: nameOpt,
    xs: 12
  },
  {
    tip: "These are the authorization flows that a client may use.",
    label: "Flows",
    attribute: "flows",
    component: "select",
    searchOn: "name",
    valueAttribute: "name",
    multiple: true,
    collection: mdls.ClientFlows,
    modelComponent: nameOpt,
    xs: 12
  },
  {
    tip: "The URIs that this client may use as redirect URIs.",
    label: "Redirect URIs",
    attribute: "uris",
    placeholder: "Redirect URIs",
    component: multitext,
    xs: 12
  }
];

var moreAtt = [
  {
    attribute: "identifier",
    label: "Client ID",
    tip: "The client ID is considered public information, and is used to build login URLs, or included in Javascript source code on a page.",
    component: "text",
    readOnly: true,
    xs: 12
  },
  {
    attribute: "secret",
    label: "Secret",
    readOnly: true,
    tip: "The client secret must be kept confidential. If a deployed app cannot keep the secret confidential, such as Javascript or native apps, then the secret is not used.",
    component: vp,
    xs: 12
  }
];


module.exports = util.rf({
  displayName: "Client Form",

  propTypes: {
    allFields: rpt.bool
  },

  getDefaultProps: function () {
    return {
      allFields: false
    };
  },

  submit: function () {
    this.refs.fm.submit();
  },

  render: function () {
    return rbs.components.layout.Form({
      ref: "fm",
      onSubmit: this.props.onSubmit
    }, [
      (this.props.allFields) ? gr({
        key: "moreAtts",
        model: this.props.model,
        attributes: moreAtt
      }) : null,
      gr({
        key: "ro1",
        model: this.props.model,
        attributes: row1
      }),
      gr({
        key: "ro2",
        model: this.props.model,
        attributes: row2
      }),
      gr({
        key: "lastrows",
        model: this.props.model,
        attributes: lastrows
      })
    ])
  }
});