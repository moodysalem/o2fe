import React, {PropTypes, PureComponent} from "react";
import _ from "underscore";
import EmptyState from "./EmptyState";
import {CONFIG_SHAPE} from "../../util/shapes";
import getLoginUrl from "../../util/getLoginUrl";

const FLOW_RESPONSE_TYPES = {
  IMPLICIT: 'token',
  CODE: 'code'
};

const MUST_HAVE_ONE_FLOW = (
  <EmptyState icon="bolt">
    Client must have one of {_.keys(FLOW_RESPONSE_TYPES).join(', ')} flows
  </EmptyState>
);

const MUST_HAVE_ONE_URI = (
  <EmptyState icon="send">
    Client must have at least one valid redirect URI
  </EmptyState>
);

const select = e => e.target.select();

export default class LoginUrls extends PureComponent {
  static contextTypes = {
    config: CONFIG_SHAPE.isRequired
  };

  static propTypes = {
    client: PropTypes.shape({
      name: PropTypes.string.isRequired,
      flows: PropTypes.arrayOf(PropTypes.string).isRequired,
      uris: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired
  };

  visitUrl = url => {
    window.open(url,)
  };

  render() {
    const {config: {API_URL}} = this.context;
    const {client: {credentials: {id: client_id}, name, flows, uris}} = this.props;

    const eligibleFlows = _.filter(flows, flow => Boolean(FLOW_RESPONSE_TYPES[flow]));

    return (
      <div>
        <h4>Login URLs for <em>{name}</em></h4>
        {
          eligibleFlows.length == 0 ?
            MUST_HAVE_ONE_FLOW :
            uris.length == 0 ?
              MUST_HAVE_ONE_URI :
              _.map(eligibleFlows, flow => {
                return (
                  <div key={flow}>
                    <h5>{flow} Flow</h5>
                    <div>
                      {
                        uris.map(uri => {
                          const loginUrl = getLoginUrl({
                            API_URL,
                            CLIENT_ID: client_id,
                            redirect_uri: uri,
                            response_type: FLOW_RESPONSE_TYPES[flow]
                          });
                          return (
                            <div key={uri} className="display-flex align-items-center">
                              <div className="flex-grow-1">
                                <label>Redirect to: <em>{uri}</em></label>
                                <input
                                  type="text" readOnly="true" onClick={select} onFocus={select}
                                  value={loginUrl}/>
                              </div>
                              <div style={{marginLeft: 8}}>
                                <a className="btn btn-flat" href={loginUrl} target="_blank" rel="noopener">
                                  <i className="fa fa-share"/>
                                </a>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                );
              })
        }
      </div>
    );
  }
}