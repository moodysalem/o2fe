import React, {PropTypes, PureComponent} from "react";
import crud from "../../util/crud";
import _ from "underscore";
import Preloader from "./Preloader";
import Pagination from "./Pagination";

const INITIAL_STATE = {
  objects: [],
  totalCount: 0,
  promise: null,
  pageInfo: {pageNo: 0, pageSize: 20},
  err: null
};

const LOADER = (
  <div key="loader" style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}
       className="display-flex align-items-center justify-content-center">
    <Preloader/>
  </div>
);

/**
 * Deals with fetching a list
 */
export default class PaginatedList extends PureComponent {
  static propTypes = {
    renderList: PropTypes.func.isRequired,
    crud: PropTypes.instanceOf(crud).isRequired,
    params: PropTypes.object
  };

  static defaultProps = {
    params: null
  };

  state = INITIAL_STATE;

  componentDidMount() {
    this.refresh();
  }

  componentWillReceiveProps({params}) {
    // params changed
    if (!_.isEqual(params, this.props.params)) {
      const {pageInfo} = this.state;
      this.setState({pageInfo: {...pageInfo, pageNo: 0}}, this.refresh());
    }
  }

  refresh = ({reset = false} = {}) => {
    const {crud, params} = this.props;
    const {pageInfo, promise:pending} = this.state;
    if (pending != null) {
      pending.cancel();
    }

    const promise = crud.list({...params, ...pageInfo})
      .then(
        ({start, totalCount, results}) => this.setState({objects: results, totalCount, promise: null}),
        err => this.setState({...INITIAL_STATE, err})
      );

    this.setState({
      promise,
      objects: reset ? [] : this.state.objects
    });
  };

  handlePageChange = (pageInfo) => {
    this.setState({pageInfo}, this.refresh);
  };

  render() {
    const {objects, promise, totalCount, pageInfo} = this.state,
      {renderList} = this.props;

    return (
      <div style={{position: 'relative'}}>
        <span key="list">
          {renderList(objects)}
        </span>

        <span key="pagination">
          <Pagination totalCount={totalCount} value={pageInfo} onChange={this.handlePageChange}/>
        </span>

        {
          promise != null ? LOADER : null
        }
      </div>
    );
  }
}