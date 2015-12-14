'use strict';
var rbs = require('react-backstrap');
var React = require('react');
var $ = require('jquery');
var dom = require('react-dom');
var _ = require('underscore');

var navbar = require('./Navbar');

var rpt = React.PropTypes;
var tp = rbs.components.controls.Tappable;
var Backbone = rbs.backbone;
var util = rbs.util;

var d = React.DOM;

// component that re-renders on application model change as well as wraps the children in a tap-friendly listener
var wrapper = util.rf({
  displayName: "Application Wrapper",

  propTypes: {
    view: rpt.func.isRequired,
    props: rpt.object
  },

  mixins: [ rbs.mixins.Model ],

  render: function () {
    util.debug("wrapper rendered.");
    return tp({}, this.props.view(this.props.props));
  }
});

var app = $("#app").get(0);
var nav = $("#nav").get(0);


// the actual backbone router
module.exports = Backbone.Router.extend({
  initialize: function (options) {
    // nav is mounted just once with the model we are passed
    this.model = options.model;
    dom.render(navbar({ model: this.model }), nav);
  },

  /**
   * Render the component into the #app container wrapper with a tap-friendly component that re-renders whenever
   * the application model changes
   * @param comp component being rendered into #app
   * @param properties properties to pass to the component
   */
  renderPage: function (comp, properties) {
    dom.render(wrapper({ view: comp, props: properties, model: this.model }), app);
  },

  routes: {
    "applications": "applications",
    "docs": "docs",
    "applications/:id": "app",
    "applications/:id/scopes": "scopes",
    "applications/:id/clients": "clients",
    "applications/:id/users": "users",
    //"clients": "myclients",
    "findapplications": "findApplications",
    //"registerclient/:id": "registerClient",
    "pricing": "pricing",
    "(/)": "home",
    "*splat": "notFound"
  },

  applications: function () {
    this.renderPage(require('./views/Applications'), {}, 'Applications');
  },

  docs: function () {
    this.renderPage(require('./views/Documentation'), {}, "Documentation");
  },

  app: function (id) {
    this.renderPage(require("./views/Application"), { id: id }, "Application");
  },

  home: function () {
    this.renderPage(require('./views/Home'), {}, "Home");
  },

  scopes: function (id) {
    this.renderPage(require("./views/Scopes"), { applicationId: id }, "Scopes");
  },

  clients: function (id) {
    this.renderPage(require("./views/Clients"), { applicationId: id }, "Clients");
  },

  users: function (id) {
    this.renderPage(require("./views/Users"), { applicationId: id }, "Users");
  },

  //myclients: function () {
  //  this.renderPage("./views/MyClients", {}, "My Clients");
  //},

  findApplications: function () {
    this.renderPage(require("./views/FindApplications"), {}, "Find Applications");
  },
  //
  //registerClient: function (id) {
  //  renderFile("js/views/RegisterClient", { applicationId: id }, "Register Client");
  //},
  //

  //
  pricing: function () {
    this.renderPage(require('./views/Pricing'), {}, "Pricing");
  },

  notFound: function () {
    this.renderPage(require('./views/NotFound'), {}, 'Page Not Found');
  }
});