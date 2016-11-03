import React, {PropTypes, PureComponent} from "react";

export default class MultiTextInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.string,
    emptyState: PropTypes.node,
    inputStyle: PropTypes.object,
    placeholder: PropTypes.string
  };

  static defaultProps = {
    value: null,
    type: 'text',
    emptyState: 'No value',
    inputStyle: {marginTop: 8}
  };

  handleChange = (val, ix) => {
    const {value, onChange} = this.props;

    const after = [...value];
    after.splice(ix, 1, val);
    onChange(after);
  };

  removeIx = ix => {
    const {value, onChange} = this.props;
    const after = [...value];
    after.splice(ix, 1);
    onChange(after);
  };

  add = () => {
    const {value, onChange} = this.props;
    onChange(value ? value.concat(['']) : ['']);
  };

  render() {
    const {value, inputStyle, placeholder, emptyState, type} = this.props;

    return (
      <div>
        <div>
          {
            value && value.length > 0 ?
              (
                value.map(
                  (val, ix) => (
                    <div key={ix} className="display-flex">
                      <input type={type} style={inputStyle} value={val || ''}
                             className="flex-grow-1"
                             placeholder={placeholder}
                             onChange={e => this.handleChange(e.target.value, ix)}/>
                      <button type="button" className="btn flex-shrink-0 btn-flat" style={{marginLeft: 8}}
                              onClick={() => this.removeIx(ix)}>
                        <i className="fa fa-trash red-text"/>
                      </button>
                    </div>
                  )
                )
              ) :
              emptyState
          }
        </div>
        <div style={{textAlign: 'center'}}>
          <button type="button" className="btn btn-flat" onClick={this.add}>
            <i className="fa fa-plus green-text"/>
          </button>
        </div>
      </div>
    );
  }
}