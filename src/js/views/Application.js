'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var af = require('./ApplicationForm');
var mdls = require('../Models');
var btn = rbs.components.controls.Button;
var _ = require('underscore');

var modal = rbs.components.layout.Modal;
var alt = rbs.components.layout.Alert;
var alerts = rbs.components.collection.Alerts;
var mbli = require('./MustBeLoggedIn');

var util = rbs.util;
var d = React.DOM;

module.exports = util.rf({
  displayName: "app",

  mixins: [ rbs.mixins.Events ],

  getInitialState: function () {
    return {
      app: (new mdls.Application({
        id: this.props.id
      })),
      deleteModalOpen: false
    };
  },

  componentDidMount: function () {
    this.state.app.fetch();
  },

  closeDeleteModal: function () {
    if (this.isMounted()) {
      this.setState({
        deleteModalOpen: false
      });
    }
  },

  render: function () {
    if (!this.props.model.token) {
      return mbli();
    }

    var dn = "Edit Application";
    return d.div({ className: "container" }, [
      d.h2({
        key: "h2",
        className: "page-header text-center"
      }, [
        btn({
          key: "back",
          type: "primary",
          caption: "Back",
          className: "pull-left",
          href: "applications",
          icon: "arrow-left"
        }),
        dn
      ]),
      af({
        key: "af",
        ref: "af",
        model: this.state.app,
        onSubmit: _.bind(function () {
          this.state.app.save();
        }, this)
      }),
      alerts({
        key: "alts",
        showSuccess: false,
        watch: this.state.app
      }),
      d.div({
        key: "btnrow",
        className: "row"
      }, [
        d.div({ className: "col-xs-6", key: "1" }, d.div({ className: "form-group" }, btn({
          caption: "Delete",
          type: "danger",
          icon: "trash",
          ajax: true,
          block: true,
          onClick: _.bind(function () {
            this.setState({
              deleteModalOpen: true
            });
          }, this)
        }))),
        d.div({ className: "col-xs-6", key: "2" }, d.div({ className: "form-group" }, btn({
          caption: "Save",
          type: "success",
          ajax: true,
          icon: "save",
          block: true,
          onClick: _.bind(function () {
            this.refs.af.submit();
          }, this)
        })))
      ]),
      modal({
        key: "dm",
        open: this.state.deleteModalOpen,
        title: "Delete Application",
        onClose: this.closeDeleteModal,
        body: alt({
          key: "p",
          level: "danger",
          strong: "Warning!",
          message: "Please confirm that you would like to delete this application. This cannot be undone."
        }),
        footer: [
          btn({
            key: "cancel",
            caption: "Cancel",
            icon: "cancel",
            ajax: true,
            onClick: this.closeDeleteModal
          }),
          btn({
            key: "del",
            caption: "Confirm Delete",
            type: "danger",
            ajax: true,
            icon: "trash",
            onClick: _.bind(function () {
              if (confirm("Please confirm this deletion. All clients, scopes, and users will be permanently deleted.")) {
                this.state.app.destroy({ wait: true }).then(_.bind(function () {
                  this.props.router.navigate("applications", { trigger: true });
                }, this));
              }
            }, this)
          })
        ]
      })
    ]);
  }
});