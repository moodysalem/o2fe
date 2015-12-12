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

var Applications = require('./views/Applications');
var NotFound = require('./views/NotFound');

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
    //"docs": "docs",
    //"applications/:id": "app",
    //"applications/:id/scopes": "scopes",
    //"applications/:id/clients": "clients",
    //"applications/:id/users": "users",
    //"clients": "myclients",
    //"findapplications": "findApplications",
    //"registerclient/:id": "registerClient",
    //"pricing": "pricing",
    //"(/)": "home",
    "*splat": "notFound"
  },

  applications: function () {
    this.renderPage(Applications, {});
  },

  //docs: function () {
  //  renderFile("js/views/Documentation", {}, "Documentation");
  //},
  //
  //app: function (id) {
  //  renderFile("js/views/Application", { id: id }, "Application");
  //},
  //
  //home: function () {
  //  renderFile("js/views/Home", {});
  //},
  //
  //scopes: function (id) {
  //  renderFile("js/views/Scopes", { applicationId: id }, "Scopes");
  //},
  //
  //clients: function (id) {
  //  renderFile("js/views/Clients", { applicationId: id }, "Clients");
  //},
  //
  //myclients: function () {
  //  renderFile("js/views/MyClients", {}, "My Clients");
  //},
  //
  //findApplications: function () {
  //  renderFile("js/views/FindApplications", {}, "Find Applications");
  //},
  //
  //registerClient: function (id) {
  //  renderFile("js/views/RegisterClient", { applicationId: id }, "Register Client");
  //},
  //
  //users: function (id) {
  //  renderFile("js/views/Users", { applicationId: id }, "Users");
  //},
  //
  //pricing: function () {
  //  renderFile("js/views/Pricing", {}, "Pricing");
  //},

  notFound: function () {
    this.renderPage(NotFound);
  }
});