import React, {PropTypes, PureComponent} from "react";
import Preloader from "./Preloader";

const LOADER = (
  <div key="loader" style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
       className="display-flex align-items-center justify-content-center">
    <Preloader/>
  </div>
);

export default class Loading extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired
  };

  render() {
    const {style, loading, children, ...rest} = this.props;

    return (
      <div style={{...style, position: 'relative'}} {...rest}>
        {children}
        {loading ? LOADER : null}
      </div>
    );
  }
}