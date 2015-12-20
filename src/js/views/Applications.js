'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var mdls = require('../Models');
var btn = rbs.components.controls.Button;
var lw = require('./Loading');
var modal = rbs.components.layout.Modal;
var model = rbs.mixins.Model;
var form = rbs.components.model.Form;
var alerts = rbs.components.collection.Alerts;
var pag = rbs.components.controls.Pagination;
var mbli = require('./MustBeLoggedIn');
var util = rbs.util;
var _ = require('underscore');


var d = React.DOM;

//var appTableColumns = [
//  {
//    label: "ID",
//    attribute: "id",
//    sortOn: "id",
//    component: d.span
//  },
//  {
//    label: "Name",
//    attribute: "name",
//    sortOn: "name",
//    component: d.span
//  },
//  {
//    label: "Support E-mail",
//    attribute: "supportEmail",
//    sortOn: "supportEmail",
//    component: d.span
//  },
//  {
//    key: "btn",
//    component: require('./ApplicationButtons')
//  }
//];

var fA = [
  {
    attribute: "name",
    label: "Name",
    tip: "Enter the name to display for this application.",
    component: "text",
    placeholder: "Application Name",
    required: true
  },
  {
    attribute: "supportEmail",
    label: "Support E-mail",
    tip: "Enter the e-mail address to which support e-mails should be sent.",
    component: "email",
    placeholder: "Support E-mail",
    required: true
  }
];

module.exports = util.rf({
  displayName: "apps",

  getInitialState: function () {
    return {
      apps: new mdls.Applications(),
      app: new mdls.Application(),
      createOpen: false
    };
  },

  componentDidMount: function () {
    this.state.apps.fetch();
  },

  closeCreate: function () {
    if (this.isMounted()) {
      this.setState({
        createOpen: false
      });
    }
  },

  render: function () {
    if (!this.props.model.token) {
      return mbli();
    }

    return d.div({
      className: "container"
    }, [
      d.h2({ className: "page-header", key: "p" }, [
        btn({
          key: "btn",
          caption: "Create",
          type: "success",
          className: "pull-right",
          icon: "plus",
          onClick: _.bind(function () {
            this.state.app.clear();
            this.setState({
              createOpen: true
            });
          }, this)
        }),
        "My Applications"
      ]),
      lw({
        key: "t",
        watch: this.state.apps
      }, [
        rbs.components.collection.Rows({
          key: "rows",
          collection: this.state.apps,
          modelComponent: require('./ApplicationThumbnail'),
          xs: 12, sm: 6, md: 4,
          emptyNode: rbs.components.layout.Alert({
            key: "empty",
            icon: "info",
            level: "info",
            strong: "Info",
            message: "No public applications found." + ((this.state.lastSearch !== "") ? " Please try a different search term." : "")
          })
        }),
        d.div({ className: "text-center", key: "pag" }, pag({
          collection: this.state.apps
        }))
      ]),

      modal({
        key: "ca",
        open: this.state.createOpen,
        title: "Create New Application",
        onClose: this.closeCreate
      }, [
        d.div({ className: "modal-body", key: "mb" }, [
          form({
            key: "f",
            ref: "_f",
            attributes: fA,
            model: this.state.app,
            onSubmit: _.bind(function () {
              this.state.app.save().then(_.bind(function (mdl) {
                this.props.router.navigate(util.path("applications", mdl.id), { trigger: true });
              }, this));
            }, this)
          }),
          alerts({
            key: "alerts",
            watch: this.state.app,
            showSuccess: false
          })
        ]),
        d.div({ className: "modal-footer", key: "mf" }, [
          btn({
            key: "cancel",
            caption: "Cancel",
            icon: "cancel",
            ajax: true,
            onClick: this.closeCreate
          }),
          btn({
            key: "cr",
            caption: "Create",
            type: "success",
            ajax: true,
            icon: "plus",
            onClick: _.bind(function () {
              this.refs._f.submit();
            }, this)
          })
        ])
      ])
    ]);
  }
});