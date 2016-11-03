import React, {PropTypes, PureComponent} from "react";

export default class ApplicationForm extends PureComponent {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  handleChange = (more) => this.props.onChange({...this.props.value, ...more});
  handleCredentialsChange = more => {
    const {googleCredentials} = this.props.value;
    const after = {...googleCredentials, ...more};

    if ((!after.id || after.id.length == 0) && (!after.secret || after.secret.length == 0)) {
      this.handleChange({googleCredentials: null});
    } else {
      this.handleChange({googleCredentials: after});
    }
  };

  render() {
    const {value, onSubmit} = this.props;

    const {name, description, faviconUrl, googleCredentials, logoUrl, stylesheetUrl, supportEmail} = value;

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
            <label>Support E-mail</label>
            <input type="text" value={supportEmail || ''}
                   onChange={e => this.handleChange({supportEmail: e.target.value})}
                   required placeholder="Support E-mail"/>
          </div>

          <div>
            <label>Description</label>
            <textarea className="materialize-textarea" value={description || ''} placeholder="Description"
                      onChange={e => this.handleChange({description: e.target.value})}/>
          </div>
        </fieldset>

        <fieldset style={{marginTop: 24}}>
          <div>
            <label>Favicon URL</label>
            <input type="text" value={faviconUrl || ''} onChange={e => this.handleChange({faviconUrl: e.target.value})}
                   placeholder="Favicon URL"/>
          </div>

          <div>
            <label>Logo URL</label>
            <input type="text" value={logoUrl || ''} onChange={e => this.handleChange({logoUrl: e.target.value})}
                   placeholder="Logo URL"/>
          </div>

          <div>
            <label>Stylesheet URL</label>
            <input type="text" value={stylesheetUrl || ''}
                   onChange={e => this.handleChange({stylesheetUrl: e.target.value})}
                   placeholder="Stylesheet URL"/>
          </div>
        </fieldset>

        <fieldset style={{marginTop: 24}}>
          <div>
            <label>Google Client ID</label>
            <input type="text" value={googleCredentials ? (googleCredentials.id || '') : ''}
                   onChange={e => this.handleCredentialsChange({id: e.target.value})}
                   placeholder="Google Client ID"/>
          </div>

          <div>
            <label>Google Client Secret</label>
            <input type="text" value={googleCredentials ? (googleCredentials.secret || '') : ''}
                   onChange={e => this.handleCredentialsChange({secret: e.target.value})}
                   placeholder="Google Client Secret"/>
          </div>
        </fieldset>
      </form>
    );
  }
}