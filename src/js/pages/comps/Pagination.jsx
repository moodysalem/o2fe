import React, {PropTypes, PureComponent} from "react";
import PageSelect from "./PageSelect";

class SizeSelect extends PureComponent {
  static propTypes = {
    sizes: PropTypes.arrayOf(PropTypes.number).isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const {sizes, value, onChange, ...rest} = this.props;

    return (
      <select value={'' + value} onChange={(e) => onChange(+e.target.value)} {...rest}>
        {
          sizes.map(size => {
            return (
              <option key={size} value={'' + size}>
                {size}
              </option>
            );
          })
        }
      </select>
    );
  }
}

export default class Pagination extends PureComponent {
  static propTypes = {
    totalCount: PropTypes.number.isRequired,
    value: PropTypes.shape({
      pageSize: PropTypes.number.isRequired,
      pageNo: PropTypes.number.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    sizes: PropTypes.arrayOf(PropTypes.number)
  };

  static defaultProps = {
    sizes: [5, 10, 20, 50, 100]
  };


  handleSelectPage = pageNo => {
    const {onChange, value} = this.props;
    onChange({...value, pageNo});
  };

  handleSelectSize = newPageSize => {
    const {onChange, value} = this.props,
      {pageNo: oldPageNo, pageSize: oldPageSize} = value;
    const firstItem = oldPageNo * oldPageSize;

    const newPageNo = Math.floor(firstItem / newPageSize);

    onChange({pageNo: newPageNo, pageSize: newPageSize});
  };

  render() {
    const {totalCount, value, sizes} = this.props;
    const {pageSize, pageNo} = value;

    const numPages = Math.max(1, Math.floor(totalCount / pageSize));

    return (
      <div className="display-flex align-items-center">
        <div className="flex-grow-1">
          <PageSelect numPages={numPages} onChange={this.handleSelectPage} value={pageNo}/>
        </div>
        <div className="flex-shrink-0" style={{minWidth: 50}}>
          <SizeSelect sizes={sizes} value={pageSize} onChange={this.handleSelectSize}
                      style={{display: 'block'}}/>
        </div>
      </div>
    );
  }
}