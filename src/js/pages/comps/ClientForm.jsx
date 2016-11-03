import React, {PropTypes, PureComponent} from "react";

export default class ClientForm extends PureComponent {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  static defaultProps = {};

  handleChange = more => this.props.onChange({...this.props.value, ...more});

  render() {
    const {value, onSubmit} = this.props;
    const {name, tokenTtl, loginCodeTtl, refreshTokenTtl} = value;

    return (
      <form onSubmit={e => {
        e.preventDefault();
        onSubmit(e);
      }}>
        <fieldset>
          <div>
            <label>Name</label>
            <input type="text" value={name || ''} onChange={e => this.handleChange({name: e.target.value})}
                   className="validate"
                   required placeholder="Name"/>
          </div>

          <div>
            <label>TTLs</label>
            <div className="display-flex flex-wrap-wrap">
              <div className="flex-grow-1">
                <label>Token</label>
                <div>
                  <input type="number" value={tokenTtl || ''} required
                         onChange={e => this.handleChange({tokenTtl: +e.target.value})}/>
                </div>
              </div>

              <div className="flex-grow-1" style={{marginLeft: 20}}>
                <label>Login Code</label>
                <div>
                  <input type="number" value={loginCodeTtl || ''} required
                         onChange={e => this.handleChange({loginCodeTtl: +e.target.value})}/>
                </div>
              </div>

              <div className="flex-grow-1" style={{marginLeft: 20}}>
                <label>Refresh Token</label>
                <div>
                  <input type="number" value={refreshTokenTtl || ''}
                         onChange={e => this.handleChange({refreshTokenTtl: +e.target.value})}/>
                </div>
              </div>
            </div>
          </div>

        </fieldset>
      </form>
    );
  }
}