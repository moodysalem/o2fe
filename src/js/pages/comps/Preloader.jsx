import React, {PropTypes, PureComponent} from "react";
import cx from "classnames";

export default class Preloader extends PureComponent {
  static propTypes = {
    size: PropTypes.oneOf(['big', 'small']),
    color: PropTypes.oneOf(['blue', 'yellow', 'green', 'red']),
    centered: PropTypes.bool
  };
  static defaultProps = {
    size: null,
    color: 'blue',
    centered: false
  };

  render() {
    const {centered, size, color} = this.props;

    const loader = (
      <div className={cx('preloader-wrapper active', size)}>
        <div className={cx('spinner-layer', color ? `spinner-${color}-only` : null)}>
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>
    );

    if (centered) {
      return <div style={{textAlign: 'center'}}>{loader}</div>;
    }
    return loader;
  }
}

export const PAGE_LOADING = <div style={{padding: 40}}><Preloader centered={true}/></div>;