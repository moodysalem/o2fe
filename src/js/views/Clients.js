'use strict';
var _ = require('underscore');
var React = require('react');
var rbs = require('react-backstrap');
var mdls = require('../Models');
var lw = require('./Loading');

var ah = require('./AppHeader');
var cf = require('./ClientForm');
var model = rbs.mixins.Model;
var row = rbs.components.model.GridRow;
var delModal = require('./ConfirmDeleteModal');
var mbli = require('./MustBeLoggedIn');
var clientActions = require('./ClientActions');

var util = rbs.util;

var table = rbs.components.combo.Table;
var pag = rbs.components.controls.Pagination;
var modal = rbs.components.layout.Modal;
var alerts = rbs.components.collection.Alerts;
var btn = rbs.components.controls.Button;

var rpt = React.PropTypes;
var d = React.DOM;

var ta = [
  {
    attribute: "name",
    sortOn: "name",
    label: "Name",
    component: d.span
  },
  {
    attribute: "type",
    sortOn: "type",
    label: "Type",
    component: d.span
  },
  {
    attribute: "tokenTtl",
    sortOn: "tokenTtl",
    label: "TTL",
    component: d.span
  },
  {
    attribute: "refreshTokenTtl",
    sortOn: "refreshTokenTtl",
    label: "Refresh TTL",
    component: d.span
  },
  {
    attribute: "flows",
    label: "Flows",
    component: d.span,
    formatFunction: function (val) {
      return val.join(", ");
    }
  },
  {
    component: clientActions
  }
];

module.exports = util.rf({
  displayName: "Clients Page",

  propTypes: {
    applicationId: rpt.string
  },

  getInitialState: function () {
    return {
      app: new mdls.Application({ id: this.props.applicationId }),
      clients: (new mdls.Clients()).setParam("applicationId", this.props.applicationId),
      client: (new mdls.Client()),
      createOpen: false,
      search: "",
      lastSearch: ""
    };
  },

  openCreate: function () {
    this.state.client.clear();
    this.state.client.set({ application: { id: +this.props.applicationId } });
    this.setState({
      createOpen: true
    });
  },

  closeCreate: function () {
    this.setState({
      createOpen: false
    });
  },

  componentDidMount: function () {
    this.state.app.fetch();
    this.state.clients.fetch();
  },

  searchChange: function (e) {
    var v = e.target.value;
    this.setState({
      search: v
    });
  },

  handleEnter: function (e) {
    if (e.keyCode === 13) {
      this.search();
      this.refs.search.blur();
    }
  },

  search: function () {
    if (this.state.search === this.state.lastSearch) {
      return;
    }
    this.state.clients.setPageNo(0).setParam("search", this.state.search).fetch();
    this.setState({
      lastSearch: this.state.search
    });
  },

  render: function () {
    if (!this.props.model.token) {
      return mbli();
    }

    return d.div({ className: "container" }, [
      ah({
        key: "h",
        title: "Clients",
        model: this.state.app,
        onCreate: this.openCreate
      }),
      d.div({
        key: "search",
        className: "row"
      }, [
        d.div({ key: "search", className: "col-sm-8" }, d.div({ className: "form-group" }, d.input({
          type: "text",
          value: this.state.search,
          ref: "search",
          placeholder: "Search Text",
          className: "form-control",
          onChange: this.searchChange,
          onKeyDown: this.handleEnter
        }))),
        d.div({ key: "btn", className: "col-sm-4" }, d.div({ className: "form-group" }, btn({
          block: true, ajax: true,
          caption: "Search",
          icon: "search",
          disabled: this.state.search === this.state.lastSearch,
          onClick: _.bind(this.search, this)
        })))
      ]),
      lw({ key: "t", watch: this.state.clients }, [
          table({
            key: "table",
            className: "vertical-align-middle",
            collection: this.state.clients,
            attributes: ta
          }),
          d.div({ key: "P", className: "text-center" }, pag({
            collection: this.state.clients
          }))
        ]
      ),

      modal({
        key: "modal",
        open: this.state.createOpen,
        title: "Add Client",
        size: "lg",
        onClose: this.closeCreate
      }, [
        d.div({
          key: "mb",
          className: "modal-body"
        }, [
          cf({
            key: "cf",
            ref: "cf",
            onSubmit: _.bind(function () {
              this.state.client.save().then(_.bind(function (model) {
                this.closeCreate();
                this.state.clients.add(model);
              }, this));
            }, this),
            model: this.state.client
          }),
          alerts({
            watch: this.state.client,
            key: "alts",
            showSuccess: false
          })
        ]),
        d.div({
          key: "mf",
          className: "modal-footer"
        }, [
          btn({
            key: "cancel",
            ajax: true,
            icon: "cancel",
            onClick: this.closeCreate,
            caption: "Cancel"
          }),
          btn({
            key: "save",
            icon: "plus",
            ajax: true,
            type: "success",
            onClick: _.bind(function () {
              this.refs.cf.submit();
            }, this),
            caption: "Add"
          })
        ])
      ])
    ]);
  }
});