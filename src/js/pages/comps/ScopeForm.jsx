import React, {PropTypes, PureComponent} from "react";

export default class ScopeForm extends PureComponent {
  static contextTypes = {};
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };
  static defaultProps = {};

  handleChange = (more) => this.props.onChange({...this.props.value, ...more});

  render() {
    const {onSubmit, value} = this.props;
    const {name, displayName, description} = value;

    return (
      <form onSubmit={e => {
        e.preventDefault();
        onSubmit(e);
      }}>
        <fieldset>
          <legend>Important Details</legend>
          <div>
            <label>Name</label>
            <input type="text" value={name || ''} onChange={e => this.handleChange({name: e.target.value})}
                   className="validate"
                   required placeholder="Name"/>
          </div>

          <div>
            <label>Display Name</label>
            <input type="text" value={displayName || ''}
                   onChange={e => this.handleChange({displayName: e.target.value})}
                   required placeholder="Display Name"/>
          </div>

          <div>
            <label>Description</label>
            <textarea className="materialize-textarea" value={description || ''} placeholder="Description"
                      onChange={e => this.handleChange({description: e.target.value})}/>
          </div>
        </fieldset>
      </form>
    );
  }
}