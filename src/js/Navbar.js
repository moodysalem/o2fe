'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');
var navbar = rbs.components.layout.Navbar;
var ng = rbs.components.layout.NavbarGroup;
var icon = rbs.components.layout.Icon;
var oauth2 = require('./OAuth2');

var tp = rbs.components.controls.Tappable;

var util = rbs.util;

module.exports = util.rf({
  displayName: "OAuth2Cloud Navbar",

  mixins: [ rbs.mixins.Model, rbs.mixins.NavbarHelper ],

  render: function () {
    var mdl = this.state.model;
    var leftLinks = [
      {
        text: "Home",
        icon: "home",
        href: "/"
      },
      {
        text: "Documentation",
        icon: "file-text",
        href: "/docs"
      },
      {
        text: "Pricing",
        icon: "money",
        href: "pricing"
      },
      {
        text: "Find Applications",
        icon: "search",
        href: "/findapplications"
      }
    ];

    var rightLinks = [];

    if (mdl.token) {
      var dn = util.concatWS(" ", mdl.token.user_details.first_name, mdl.token.user_details.last_name);
      rightLinks.push(
        {
          text: "Logged in as " + dn
        },
        {
          text: "Admin",
          icon: "wrench",
          menu: [
            {
              text: "My Applications",
              icon: "tachometer",
              href: "/applications"
            },
            {
              text: "My Clients",
              icon: "key",
              href: "/clients"
            }
          ]
        },
        {
          text: "Log Out",
          icon: "sign-out",
          onClick: function (e) {
            e.preventDefault();
            m.clear();
            oauth2.logout().then(function () {
              util.debug("loggedout");
            }, function () {
              util.debug("loggedout with error");
            });
          }
        });
    } else {
      rightLinks.push({
        text: "Log In",
        icon: "sign-in",
        href: "#",
        onClick: function (e) {
          e.preventDefault();
          oauth2.login();
        }
      });
    }

    return tp({}, navbar({
      brand: React.DOM.span({}, [
        icon({ key: "i", name: "chain", style: { color: "cornflowerblue" } }),
        "OAuth2 Cloud"
      ])
    }, [
      ng({
        key: "ll"
      }, this.buildLinks(leftLinks)),
      ng({
        key: "rl",
        right: true
      }, this.buildLinks(rightLinks))
    ]));
  }
});