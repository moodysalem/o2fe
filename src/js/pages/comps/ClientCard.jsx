import React, {PropTypes, PureComponent} from "react";
import {NOTIFICATION_HANDLERS} from "../../util/shapes";
import CopyRow from "./CopyRow";

const N_A = <em className="grey-text lighten-2">N/A</em>;

export default class ClientCard extends PureComponent {
  static propTypes = {
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onViewScopes: PropTypes.func.isRequired,
    onViewUrls: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired
  };

  static contextTypes = {
    ...NOTIFICATION_HANDLERS
  };

  static defaultProps = {};

  handleCopy = name => this.context.onInfo(`Copied ${name} to clipboard!`);

  render() {
    const {
      onEdit, onDelete, onViewScopes, onViewUrls,
      client: {
        id, name, confidential, credentials: {id: cid, secret: secret}, flows,
        loginCodeTtl, refreshTokenTtl, showPromptNoScopes, tokenTtl, uris
      }
    } = this.props;

    return (
      <div className="card" key={id}>
        <div className="card-content">
          <span className="card-title">
            <span style={{marginRight: 8}}>{name}</span>
            <i className={`fa fa-eye${confidential ? '-slash' : ''}`}/>
          </span>

          <hr />

          <div>
            <CopyRow label="Client ID" value={cid} onCopy={() => this.handleCopy('Client ID')}/>
            <CopyRow label="Client Secret" value={secret} onCopy={() => this.handleCopy('Client Secret')}/>

            <div>
              <label>TTLs</label>
              <div className="display-flex flex-wrap-wrap">
                <div style={{marginRight: 20}}>
                  <label>Login Code</label>
                  <div>{loginCodeTtl}s</div>
                </div>
                <div style={{marginRight: 20}}>
                  <label>Token</label>
                  <div>{tokenTtl}s</div>
                </div>
                <div>
                  <label>Refresh Token</label>
                  <div>{refreshTokenTtl ? `${refreshTokenTtl}s` : N_A}</div>
                </div>
              </div>
            </div>

            <div>
              <label>Flows</label>
              <div>{flows && flows.length > 0 ? flows.join(', ') : N_A}</div>
            </div>

            <div>
              <label>Allowed URIs</label>
              <div>
                {uris && uris.length > 0 ? uris.map((uri, ix) => <div key={ix}>{uri}</div>) : N_A}
              </div>
            </div>

            <div className="display-flex">
              <div>
                <label>Always Show Scopes Prompt</label>
                <div>{showPromptNoScopes ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-action">
          <a href="#" onClick={e => {
            e.preventDefault();
            onViewScopes();
          }}>Assign Scopes</a>
          <a href="#" onClick={e => {
            e.preventDefault();
            onViewUrls();
          }}>View URLs</a>
          <a href="#" onClick={e => {
            e.preventDefault();
            onEdit();
          }}>Edit</a>
          <a href="#" className="red-text" onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}>Delete</a>
        </div>
      </div>
    );
  }
}