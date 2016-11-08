import React, {PropTypes, PureComponent} from "react";

export default class ClientCard extends PureComponent {
  static propTypes = {
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onViewScopes: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired
  };

  static defaultProps = {};

  render() {
    const {
      onEdit, onDelete, onViewScopes,
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
            <div>
              <label>Client ID</label>
              <div style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{cid}</div>
            </div>

            <div>
              <label>Client Secret</label>
              <div style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{secret}</div>
            </div>

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
                  <div>{refreshTokenTtl ? `${refreshTokenTtl}s` : <em>N/A</em>}</div>
                </div>
              </div>
            </div>

            <div>
              <label>Flows</label>
              <div>{flows.join(', ')}</div>
            </div>

            <div>
              <label>Allowed URIs</label>
              <div>
                {
                  uris.map(uri => <div key={uri}>{uri}</div>)
                }
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
          }}>View Scopes</a>
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