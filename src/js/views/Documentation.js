'use strict';
var React = require('react');
var rbs = require('react-backstrap');
var _ = require('underscore');
var ep = require('./Endpoint');
var fixToTop = rbs.components.layout.FixToTop;
var util = rbs.util;
var d = React.DOM;
var rpt = React.PropTypes;

var GRANT_TYPE_DESCRIPTION = "The grant_type is one of the following values: 'authorization_code', 'password', 'client_credentials', 'refresh', or 'temporary_token'";

var OAUTH = util.path(config.API_URL, "oauth");
var AUTHORIZE = util.path(OAUTH, "authorize");
var TOKEN = util.path(OAUTH, "token");
var TOKEN_INFO = util.path(TOKEN, "info");
var GET_LOGIN_STATUS = util.path(OAUTH, "loginstatus");

module.exports = util.rf({
  displayName: "Docs",

  getInitialState: function () {
    return {};
  },

  render: function () {
    var toc = d.div({}, [
      d.h5({ key: "h5" }, "Table of Contents"),
      d.hr({ key: "hr" }),
      d.ul({ key: "ul" }, [
        d.li({ key: "intro" }, d.a({ href: "#intro" }, "Introduction")),
        d.ul({ key: "sub" }, [
          d.li({ key: "purpose" }, d.a({ href: "#purpose" }, "Purpose")),
          d.li({ key: "structure" }, d.a({ href: "#structure" }, "Application Structure"))
        ]),
        d.li({ key: "api" }, d.a({ href: "#api" }, "Developer API")),
        d.ul({ key: "subapi" }, [
          d.li({ key: "a" }, d.a({ href: "#oauth2" }, "OAuth2")),
          d.ul({ key: "suboauth" }, [
            d.li({ key: "1" }, d.a({ href: "#authorization_code" }, "Authorization Code")),
            d.li({ key: "2" }, d.a({ href: "#resource_owner_password" }, "Resource Owner Password")),
            d.li({ key: "3" }, d.a({ href: "#client_credentials" }, "Client Credentials")),
            d.li({ key: "4" }, d.a({ href: "#refresh_token" }, "Refresh Token")),
            d.li({ key: "5" }, d.a({ href: "#temporary_token" }, "Temporary Token")),
            d.li({ key: "6" }, d.a({ href: "#token_info" }, "Token Info")),
            d.li({ key: "7" }, d.a({ href: "#get_login_status" }, "Get Login Status"))
          ]),
          d.li({ key: "a2" }, d.a({ href: "#admin" }, "Admin"))
        ]),
        d.li({ key: "addtl" }, d.a({ href: "#addtl" }, "Additional Features")),
        d.ul({ key: "subaddtl" }, [
          d.li({ key: "a" }, d.a({ href: "#legacy" }, "Legacy Integration"))
        ])
      ])
    ]);

    return d.div({ className: "container-fluid" }, [
      d.div({ className: "row", key: "1" }, [
        d.div({ key: "c", className: "col-lg-9" }, d.h2({
          key: "1",
          className: "page-header"
        }, "Documentation"))
      ]),
      d.div({ className: "row", key: "2" }, [
        d.div({ className: "hidden-lg some-padding", key: "toc-small" }, d.div({
          className: "well",
          key: "toc"
        }, toc)),
        d.div({ className: "col-lg-9", key: "content" }, [
          d.h3({ key: "intro", id: "intro" }, "Introduction"),
          d.p({ key: "ip" }, "Applications often require users to authenticate to access their own data and use services. These " +
            " services often store and transmit user data, such as e-mails, passwords, and names. Completing a secure and reliable OAuth2 " +
            " specification is time consuming and difficult. OAuth2Cloud aims to provide a customizable OAuth2 implementation as a service."),
          d.h4({ key: "purpose", id: "purpose" }, "Purpose"),
          d.p({ key: "pp" }, "To provide a stable and reliable identity platform on which you can build secure APIs, register " +
            " third party and internal clients for your APIs, and authenticate users and clients for these APIs."),
          d.h4({ key: "structure", id: "structure" }, "Application Structure"),
          d.p({ key: "pp2" }, "OAuth2Cloud follows the OAuth2 specification as closely as possible. For user authentication, you can permit " +
            " clients to use any of the grant methods defined in the ", d.a({
            key: "A",
            href: "https://tools.ietf.org/html/rfc6749"
          }, "specification"), ". After receiving an access token from OAuth2Cloud, clients will pass the tokens to your " +
            " API servers using bearer HTTP authentication. Your API server then verifies with OAuth2Cloud's token info endpoint " +
            " that the token has the proper scopes, and uses the user information to customize the response. "),
          d.h3({ key: "api", id: "api" }, "Developer API"),
          d.p({ key: "apiinfo" }, "OAuth2Cloud provides the typical OAuth2 specification authorize and token endpoints in addition to an API for " +
            " managing your OAuth2 resources. In order to access the administrative API, you must register a client with the OAuth2Cloud application."),
          d.h4({ key: "oauth2", id: "oauth2" }, "OAuth2"),
          d.div({ key: "oauth2info" }, [
            d.p({ key: "1" }, "To access the login screen for your application, use the authorize endpoint."),
            ep({
              key: "2",
              method: "GET",
              openUrl: true,
              endpoint: AUTHORIZE,
              parameters: [
                {
                  req: true,
                  name: "response_type",
                  type: "string",
                  loc: "query",
                  opts: [ "token", "code" ],
                  desc: "Either token or code, depending on the desired response type. See the OAuth2 specification."
                },
                {
                  req: true,
                  name: "client_id",
                  type: "string",
                  loc: "query",
                  desc: "The ID of the client that is attempting to get user authorization."
                },
                {
                  req: true,
                  name: "redirect_uri",
                  type: "string",
                  loc: "query",
                  desc: "The location to which the user should be redirected after completing or cancelling authentication."
                },
                {
                  req: false,
                  name: "scope",
                  type: "string",
                  loc: "query",
                  desc: "A space-delimited list of scopes that the client requires. Listing scopes that the client cannot access here will " +
                  "cause an error to be displayed to the user."
                },
                {
                  req: false,
                  name: "logout",
                  type: "boolean",
                  loc: "query",
                  opts: [ "true" ],
                  desc: "Pass true to log the user out. This is especially useful when the user must accept certain scopes to continue."
                }
              ]
            }),
            d.p({ key: "3" }, "To exchange an authorization code for a token, or exchange a refresh token for another " +
              "access token, use the token endpoint. Each of these actions requires a different grant_type."),
            d.h5({ className: "section-header", key: "h51", id: "authorization_code" }, "Authorization Code"),
            d.p({ key: "authorization_code_p"}, "Use this endpoint to exchange an authorization code for an ACCESS token."),
            ep({
              key: "4",
              method: "POST",
              endpoint: TOKEN,
              parameters: [
                {
                  req: true,
                  name: "grant_type",
                  value: "authorization_code",
                  type: "string",
                  loc: "body",
                  desc: GRANT_TYPE_DESCRIPTION
                },
                {
                  req: true,
                  name: "code",
                  type: "string",
                  loc: "body",
                  desc: "The authorization code received as a query parameter in the redirect URI from the authorize endpoint."
                },
                {
                  req: true,
                  name: "redirect_uri",
                  type: "string",
                  loc: "body",
                  desc: "The exact redirect URI with which the authorization code grant flow was initialized."
                },
                {
                  req: true,
                  name: "client_id",
                  type: "string",
                  loc: "body",
                  desc: "The ID of the client that requested the authorization code "
                },
                {
                  req: false,
                  name: "Authorization",
                  type: "string",
                  loc: "header",
                  desc: "'Basic ' followed by the base64-encoded clientid:secret. This is required if the client is confidential."
                }
              ]
            }),
            d.h5({ className: "section-header", key: "h52", id: "resource_owner_password" }, "Resource Owner Password"),
            d.p({ key: "resource_owner_password_p" }, "Use this endpoint to exchange user credentials (e-mail and password) for " +
              "an access token. Since this credential flow does not prompt the user for permission to access specific scopes, " +
              "provide this only for clients that you can trust."),
            ep({
              key: "password",
              method: "POST",
              endpoint: TOKEN,
              parameters: [
                {
                  req: true,
                  name: "grant_type",
                  value: "password",
                  type: "string",
                  loc: "body",
                  desc: GRANT_TYPE_DESCRIPTION
                },
                {
                  req: true,
                  name: "Authorization",
                  type: "string",
                  loc: "header",
                  desc: "'Basic ' followed by the base64-encoded clientid:secret. This is required for the resource owner password flow."
                },
                {
                  req: true,
                  name: "username",
                  type: "string",
                  loc: "body",
                  desc: "The e-mail address of the user."
                },
                {
                  req: true,
                  name: "password",
                  type: "string",
                  loc: "body",
                  desc: "The password of the user."
                },
                {
                  req: false,
                  name: "scope",
                  type: "string",
                  loc: "query",
                  desc: "A space-delimited list of scopes that the client requires. Listing scopes that the client cannot access here will " +
                  "cause an error to be displayed to the user."
                }
              ]
            }),
            d.h5({ className: "section-header", key: "h53", id: "client_credentials" }, "Client Credentials"),
            d.p({ key: "client_credentials_p" }, "Use this endpoint to receive a CLIENT access token, which represents " +
              "an application rather than an individual user."),
            ep({
              key: "client_credentials",
              method: "POST",
              endpoint: TOKEN,
              parameters: [
                {
                  req: true,
                  name: "grant_type",
                  value: "client_credentials",
                  type: "string",
                  loc: "body",
                  desc: GRANT_TYPE_DESCRIPTION
                },
                {
                  req: true,
                  name: "Authorization",
                  type: "string",
                  loc: "header",
                  desc: "'Basic ' followed by the base64-encoded clientid:secret. This is required for the resource owner password flow."
                },
                {
                  req: false,
                  name: "scope",
                  type: "string",
                  loc: "body",
                  desc: "The scopes for which the client is requesting a token."
                }
              ]
            }),
            d.h5({ className: "section-header", key: "h54", id: "refresh_token" }, "Refresh Token"),
            d.p({ key: "refresh_token_p" }, "Use this endpoint to retrieve a new ACCESS token for the client associated " +
              "with the passed refresh token. The new access token will have the same scopes as the refresh token, limited " +
              "further by the scopes specified in the scope parameter."),
            ep({
              key: "refresh",
              method: "POST",
              endpoint: TOKEN,
              parameters: [
                {
                  req: true,
                  name: "grant_type",
                  value: "refresh_token",
                  type: "string",
                  loc: "body",
                  desc: GRANT_TYPE_DESCRIPTION
                },
                {
                  req: true,
                  name: "Authorization",
                  type: "string",
                  loc: "header",
                  desc: "'Basic ' followed by the base64-encoded clientid:secret. This is required for the resource owner password flow."
                },
                {
                  req: true,
                  name: "refresh_token",
                  type: "string",
                  loc: "body",
                  desc: "The refresh token for the user for which a new access token should be obtained."
                },
                {
                  req: false,
                  name: "scope",
                  type: "string",
                  loc: "body",
                  desc: "The scopes for which the access token should be valid. These scopes cannot exceed the scopes " +
                  " for which the refresh token was obtained, even if the user has accepted those scopes for the client " +
                  "to which the refresh token was distributed."
                }
              ]
            }),
            d.h5({ className: "section-header", key: "temporary_token", id: "temporary_token" }, "Temporary Token"),
            d.p({ key: "temporary_tokenp" }, "Use this endpoint to retrieve a short-lived token. This short-lived lasts five minutes" +
              " and is intended to be used where the token cannot be communicated via header, e.g. private file download links."),
            ep({
              key: "temporary_token_ep",
              method: "POST",
              endpoint: TOKEN,
              parameters: [
                {
                  req: true,
                  name: "grant_type",
                  value: "temporary_token",
                  type: "string",
                  loc: "body",
                  desc: GRANT_TYPE_DESCRIPTION
                },
                {
                  req: true,
                  name: "access_token",
                  type: "string",
                  loc: "body",
                  desc: "The access token that is being used to fetch a temporary token. The temporary token will have the same " +
                  " scopes as the passed access_token."
                },
                {
                  req: true,
                  name: "client_id",
                  type: "string",
                  loc: "body",
                  desc: "The ID of the client for which a temporary token is being retrieved."
                }
              ]
            }),
            d.h5({ className: "section-header", key: "tokeninfo", id: "token_info" }, "Token Info"),
            d.p({ key: "tokeninfo_p" }, "Use this endpoint on the client and server to validate the token and retrieve basic information about the user."),
            ep({
              key: "tokeninfo_ep",
              method: "POST",
              endpoint: TOKEN_INFO,
              parameters: [
                {
                  req: true,
                  name: "token",
                  type: "string",
                  loc: "body",
                  desc: "The token being queried"
                },
                {
                  req: false,
                  name: "client_id",
                  type: "string",
                  loc: "body",
                  desc: "The ID of the client making the request. The client ID OR the application ID is required."
                },
                {
                  req: false,
                  name: "application_id",
                  type: "string",
                  loc: "body",
                  desc: "The ID of the application making the request. The application ID OR the application ID is required."
                }
              ]
            }),
            d.h5({ className: "section-header", key: "getloginstatus", id: "get_login_status" }, "Get Login Status"),
            d.p({ key: "getloginstatus_p" }, "Use this endpoint to get the user's login status for your application. This endpoint does not allow CORS, so you must access it via an iFrame. It communicates to the parent window via postMessage, and can only be opened as an iFrame for pages with redirect URIs matching the client's allowed redirect URIs."),
            ep({
              key: "getloginstatus_ep",
              method: "GET",
              endpoint: GET_LOGIN_STATUS,
              noSend: true,
              parameters: [
                {
                  req: true,
                  name: "client_id",
                  type: "string",
                  loc: "query",
                  desc: "The ID of the client checking the login status"
                }
              ]
            })
          ]),
          d.h4({ key: "admin", id: "admin" }, "Admin"),
          d.p({ key: "admininfo" }, "This documentation is not yet complete. In the meantime, please use the administrative features on this " +
            "website to manage your OAuth2 application."),
          d.h3({ key: "addtnl", id: "addtl" }, "Additional Features"),
          d.h4({ key: "legacy", id: "legacy" }, "Legacy Integration"),
          d.p({
            key: "legacyinfo"
          }, "You may need to integrate with an existing database of users. We allow existing users' e-mails and passwords " +
            " to be ported via and endpoint that is hit with every failed login attempt. You can specify this endpoint" +
            " in your application settings. This endpoint will receive a POST containing the e-mail and password and should return " +
            " the user's first name and last name if the user's credentials are valid. OAuth2Cloud will then create a user and issue " +
            " an OAuth2 token."),
          ep({
            key: "lgep",
            noSend: true,
            endpoint: "https://your-legacy-url.com",
            method: "POST",
            parameters: [
              {
                req: true,
                name: "email",
                type: "string",
                loc: "body",
                desc: "The e-mail address that the user entered."
              },
              {
                req: true,
                name: "password",
                type: "string",
                loc: "body",
                desc: "The password that the user entered."
              }
            ]
          })
        ]),
        d.div({
          key: "col2",
          className: "col-lg-3 hidden-xs hidden-sm hidden-md"
        }, fixToTop({ key: "toc-big", className: "well" }, toc))
      ])
    ]);
  }
});