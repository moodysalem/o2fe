import React, {PropTypes, Component, PureComponent} from "react";
import {CONFIG_SHAPE} from "../util/shapes";
import join from "url-join";
import _ from "underscore";
import {Link} from "react-router";

export default class Docs extends PureComponent {
  static propTypes = {
    params: PropTypes.shape({
      section: PropTypes.string
    }).isRequired
  };

  static contextTypes = {
    config: CONFIG_SHAPE.isRequired,
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.scrollToSection(this.props.params.section);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = _.throttle(e => {
    const {scrollY} = window;
    const {router} = this.context;

    const highest = _.chain(this.refs)
      .mapObject(el => el.offsetTop)
      .omit(top => top < scrollY)
      .map((top, ref) => ([top, ref]))
      .sortBy(([top, ref]) => top)
      .first()
      .value()[1];

    router.replace(`docs/${highest}`);
  }, 100);

  scrollToSection = (section) => {
    if (!section) {
      window.scrollTo(0, 0);
    } else {
      const {[section]: sectionRef} = this.refs;
      if (sectionRef) {
        window.scrollTo(0, sectionRef.offsetTop);
      }
    }
  };

  handleClick(to) {
    this.scrollToSection(to);
  }

  render() {
    const {config} = this.context;

    const HL = ({to}) => (
      <Link className="visible-on-parent-hover" to={join('docs', to)} onClick={() => this.handleClick(to)}>
        <i className="fa fa-link grey-text"/>
      </Link>
    );

    return (
      <div className="container" style={{marginBottom: 60}}>
        <h1 ref="top" className="overflow-ellipsis">Docs</h1>
        <h2 ref="intro" className="overflow-ellipsis">Introduction <HL to="intro"/></h2>
        <p className="flow-text">
          This specification describes the functionality and the expected behavior of this OAuth2 server.

          For more general information about OAuth2, check out
          the <a target="_blank" rel="noopener" href="https://tools.ietf.org/html/rfc6749">specification</a>.
        </p>
        <h2 ref="api" className="overflow-ellipsis">API <HL to="api"/></h2>
        <p className="flow-text">
          Live documentation for the API can be found
          at <a target="_blank" rel="noopener" href="https://docs.oauth2cloud.com/#/oauth2">docs.oauth2cloud.com</a>.
          The endpoints used for authentication and authorization are tagged <strong>oauth2</strong>.
        </p>
        <p>
          This API documentation will always be up-to-date and accurate, since they are generated by the server. Feel
          free to watch the <a href={join(config.API_URL, 'swagger.json')}>source JSON file</a> for changes!
        </p>
        <hr />

        <h2 ref="functionality" className="overflow-ellipsis">Functionality <HL to="functionality"/></h2>

        <h3 ref="authentication" className="overflow-ellipsis">Authentication <HL to="authentication"/></h3>
        <p className="flow-text">
          This OAuth2 server does not allow log in via e-mail and password combinations. Rather the only methods
          available for user authentication are via e-mail or third party provider (e.g. Google or Facebook.)
        </p>
        <h4 ref="email" className="overflow-ellipsis">Via E-mail <HL to="email"/></h4>
        <p>
          The user enters an e-mail address and receives an e-mail with a link to log in. The duration for which this
          link will work is configurable. Once clicked, the user is directed to a page where they may authorize any
          client requested scopes.
        </p>

        <h3 ref="provider-log-in">Providers <HL to="provider-log-in"/></h3>
        <p className="flow-text">
          In order for users to be able to log in via Facebook and Google, you must create corresponding clients in the
          Facebook and Google developer consoles respectively.
        </p>
        <h4 ref="google" className="overflow-ellipsis">Via Google <HL to="google"/></h4>
        <p>
          The user clicks a link where they are directed to sign in via Google. Once logged in to Google, they will be
          redirected back to OAuth2Cloud to authorize any client-requested scopes.
        </p>

        <h4 ref="facebook" className="overflow-ellipsis">Via Facebook <HL to="facebook"/></h4>
        <p>
          The user clicks a link where they are directed to sign in via Facebook. Once logged in to Facebook, they will
          be redirected back to OAuth2Cloud to authorize any client-requested scopes. The 'email' scope must be used
          in order to log in via OAuth2Cloud.
        </p>

        <h3 ref="authorization" className="overflow-ellipsis">Authorization <HL to="authorization"/></h3>
        <p>
          This OAuth2 server supports defining scopes and assigning scopes to different clients with three different
          priorities.
        </p>
        <ul>
          <li>
            <strong>Required</strong>: The user may not log in to a particular client without accepting this scope.
            Information about the scope is provided but the user does not have the option to decline the scope and
            continue.
          </li>
          <li>
            <strong>Required &amp; Hidden</strong>: The user will not be prompted to authorize this scope, but any
            tokens
            created will have the scope. The user will not be shown details about the scope.
          </li>
          <li>
            <strong>Ask</strong>: The user will be asked for this scope and may decline to provide it for the client.
          </li>
        </ul>

        <h3 ref="user-linking" className="overflow-ellipsis">Linking Users <HL to="user-linking"/></h3>
        <p>
          Because we cannot merge your user-associated data, we allow you to link users via this administrative website.
        </p>
        <p>
          When retrieving token information for a linked user, you will see the e-mail address used to log in, in
          addition to information for all users linked to that user. There is however no concept of a <em>primary</em>
          user. You will always see the e-mail used to log in first.
        </p>

        <hr />
        <h2 ref="customization" className="overflow-ellipsis">Customizing your Log In Page <HL to="customization"/></h2>
        <h3 ref="style" className="overflow-ellipsis">Style <HL to="style"/></h3>
        <p className="flow-text">
          OAuth2Cloud supports injecting your own stylesheets, favicons, and logo URLs into your authentication and
          authorization pages
        </p>

        <h3 ref="domain" className="overflow-ellipsis">Using your own domain <HL to="domain"/></h3>
        <p className="flow-text">
          You can send users to a log in page on your own domain, e.g. login.my-site.com
        </p>
        <ol>
          <li>Configure a CDN (e.g. AWS CloudFront or Cloudflare) to use api.oauth2cloud.com as an origin server.</li>
          <li>Configure your CDN to serve your own SSL certificates</li>
          <li>Point your DNS at the CDN-provided domain</li>
        </ol>
      </div>
    );
  }
}