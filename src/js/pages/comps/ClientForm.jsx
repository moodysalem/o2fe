import React, {PropTypes, PureComponent} from "react";
import Switch from "./Switch";
import MultiTextInput from "./MultiTextInput";
import _ from "underscore";

const FLOWS = [
  {value: 'IMPLICIT', label: 'Implicit Flow'},
  {value: 'CODE', label: 'Code Flow'},
  {value: 'CLIENT_CREDENTIALS', label: 'Client Credentials'},
  {value: 'RESOURCE_OWNER_CREDENTIALS', label: 'Resource Owner Credentials'}
];

export default class ClientForm extends PureComponent {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  static defaultProps = {};

  handleChange = more => this.props.onChange({...this.props.value, ...more});

  handleFlowSwitch = (flow, switched) => {
    const {value} = this.props;
    const {flows} = value;
    if (switched) {
      if (flows) {
        this.handleChange({flows: _.uniq([flow].concat(flows))});
      } else {
        this.handleChange({flows: [flow]});
      }
    } else {
      this.handleChange({flows: _.without(flows, flow)});
    }
  };

  render() {
    const {value, onSubmit} = this.props;
    const {name, tokenTtl, loginCodeTtl, refreshTokenTtl, confidential, flows, uris, showPromptNoScopes} = value;

    const flowIndex = _.countBy(flows, f => f);

    return (
      <form onSubmit={e => {
        e.preventDefault();
        onSubmit(e);
      }}>
        <fieldset>
          <legend>Important Details</legend>
          <div className="display-flex align-items-center">
            <div className="flex-grow-1">
              <label>Name</label>
              <input type="text" value={name || ''} onChange={e => this.handleChange({name: e.target.value})}
                     className="validate"
                     required placeholder="Name"/>
            </div>
            <div className="flex-shrink-0" style={{marginLeft: 20}}>
              <label>Confidential</label>
              <Switch switched={confidential} onSwitch={confidential => this.handleChange({confidential})}/>
            </div>
          </div>

          <div>
            <label>TTLs <em>(in seconds)</em></label>
            <div className="display-flex flex-wrap-wrap align-items-center">
              <div className="flex-grow-1" style={{padding: 10}}>
                <label>Token TTL</label>
                <div>
                  <input type="number" value={tokenTtl || ''} required
                         onChange={e => this.handleChange({tokenTtl: +e.target.value})}/>
                </div>
              </div>

              <div className="flex-grow-1" style={{padding: 10}}>
                <label>Login Code TTL</label>
                <div>
                  <input type="number" value={loginCodeTtl || ''} required
                         onChange={e => this.handleChange({loginCodeTtl: +e.target.value})}/>
                </div>
              </div>

              <div className="flex-grow-1" style={{padding: 10}}>
                <label>Refresh Token TTL</label>
                <div>
                  <input type="number" value={refreshTokenTtl || ''}
                         onChange={e => this.handleChange({refreshTokenTtl: +e.target.value})}/>
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset style={{marginTop: 20}}>
          <legend>Flows</legend>
          <div className="display-flex flex-wrap-wrap justify-content-space-between">
            {
              FLOWS.map(({value, label}) => (
                <div className="flex-grow-1" key={value}>
                  <label htmlFor={value}>{label}</label>
                  <Switch id={value} onSwitch={(switched) => this.handleFlowSwitch(value, switched)}
                          switched={Boolean(flowIndex[value])}/>
                </div>
              ))
            }
          </div>
        </fieldset>

        <fieldset style={{marginTop: 20}}>
          <legend>Allowed Redirect URIs</legend>
          <div>
            <MultiTextInput type="url" value={uris} placeholder="https://google.com"
                            onChange={uris => this.handleChange({uris})}
                            emptyState={<strong>No configured URIs</strong>}/>
          </div>
        </fieldset>

        <fieldset style={{marginTop: 20}}>
          <legend>Other</legend>
          <div>
            <label>Always Show Scopes Prompt</label>
            <Switch switched={showPromptNoScopes}
                    onSwitch={showPromptNoScopes => this.handleChange({showPromptNoScopes})}/>
          </div>
        </fieldset>
      </form>
    );
  }
}