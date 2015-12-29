var _ = require('underscore');
var mdls = require('../Models');

var rbs = require('react-backstrap');
var util = rbs.util;
var alerts = rbs.components.collection.Alerts;
var modal = rbs.components.layout.Modal;

var React = require('react');
var d = React.DOM;

var btn = rbs.components.controls.Button;
var clientUrlsModal = require('./ClientURLsModal');
var delModal = require('./ConfirmDeleteModal');
var cf = require('./ClientForm');
var clientScopesModal = require('./ClientScopesModal');

module.exports = util.rf({
  displayName: "actions for client",

  mixins: [ rbs.mixins.Model ],

  getInitialState: function () {
    return {
      editOpen: false,
      modelCopy: new mdls.Client(),
      scopesOpen: false,
      deleteOpen: false,
      urlsOpen: false
    };
  },

  closeEdit: function () {
    this.setState({
      editOpen: false
    });
  },

  openEdit: function () {
    this.state.modelCopy.set(this.props.model.toJSON());
    this.setState({
      editOpen: true
    });
  },

  openScopes: function () {
    this.setState({
      scopesOpen: true
    });
  },

  closeScopes: function () {
    this.setState({
      scopesOpen: false
    });
  },

  openDelete: function () {
    this.setState({
      deleteOpen: true
    });
  },

  closeDelete: function () {
    this.setState({
      deleteOpen: false
    });
  },

  openUrls: function () {
    this.setState({
      urlsOpen: true
    });
  },
  closeUrls: function () {
    this.setState({
      urlsOpen: false
    });
  },

  render: function () {
    return d.div({}, [
      d.div({
        key: "dd",
        className: "text-center btn-container"
      }, [
        btn({
          key: "edit",
          type: "warning",
          size: "xs",
          caption: "Edit",
          icon: "pencil",
          onClick: this.openEdit
        }),
        btn({
          key: "urls",
          size: "xs",
          type: "info",
          caption: "URLs",
          icon: "share-alt",
          onClick: this.openUrls
        }),
        btn({
          key: "scopes",
          size: "xs",
          caption: "Scopes",
          type: "primary",
          icon: "book",
          onClick: this.openScopes
        }),
        btn({
          key: "del",
          size: "xs",
          type: "danger",
          caption: "Delete",
          icon: "trash",
          onClick: this.openDelete
        })
      ]),
      delModal({
        key: "delmodal",
        title: "Delete Client: " + this.state.model.name,
        open: this.state.deleteOpen,
        onDelete: _.bind(function () {
          this.props.model.destroy({ wait: true });
        }, this),
        deleteMessage: "This will invalidate all the tokens and user permissions distributed to this client.",
        onClose: this.closeDelete
      }),
      clientUrlsModal({
        key: "urls",
        open: this.state.urlsOpen,
        title: "Flow URLs for " + this.state.model.name,
        onClose: this.closeUrls,
        model: this.props.model
      }),
      modal({
        key: "modal",
        open: this.state.editOpen,
        title: "Edit " + this.state.model.name,
        size: "lg",
        onClose: this.closeEdit,
        body: [
          cf({
            allFields: true,
            key: "cf",
            ref: "cf",
            onSubmit: _.bind(function () {
              this.state.modelCopy.save().then(_.bind(function (model) {
                this.props.model.set(model);
                this.closeEdit();
              }, this));
            }, this),
            model: this.state.modelCopy
          }),
          alerts({
            watch: this.state.modelCopy,
            key: "alts",
            showSuccess: false
          })
        ],
        footer: [
          btn({
            key: "cancel",
            ajax: true,
            icon: "cancel",
            onClick: this.closeEdit,
            caption: "Cancel"
          }),
          btn({
            key: "save",
            icon: "save",
            ajax: true,
            type: "success",
            onClick: _.bind(function () {
              this.refs.cf.submit();
            }, this),
            caption: "Save"
          })
        ]
      }),

      clientScopesModal({
        key: "scopes",
        open: this.state.scopesOpen,
        title: "Edit Scopes for " + this.state.model.name,
        size: "lg",
        onClose: this.closeScopes,
        clientId: this.state.model.id,
        applicationId: this.state.model.application.id
      })
    ]);
  }
});