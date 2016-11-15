import React, {PropTypes, PureComponent} from "react";
import crud from "../../util/crud";
import _ from "underscore";
import Pagination from "./Pagination";
import {pageParams} from "../../util/params";
import Loading from "./Loading";

const INITIAL_STATE = {
  objects: [],
  totalCount: 0,
  promise: null,
  pageInfo: {pageNo: 0, pageSize: 20},
  err: null
};

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

  componentWillReceiveProps(nextProps) {
    // params changed
    if (!_.isEqual(nextProps.params, this.props.params)) {
      const {pageInfo} = this.state;
      this.setState({pageInfo: {...pageInfo, pageNo: 0}}, this.debouncedRefresh);
    }
  }

  refresh = () => this.refreshWith(this.props, this.state);
  debouncedRefresh = _.debounce(this.refresh, 100);

  refreshWith = (props, state) => {
    const {crud, params} = props,
      {pageInfo, promise: pending} = state;

    if (pending != null) {
      pending.cancel();
    }

    const promise = crud.list({...params, ...pageParams(pageInfo)})
      .then(
        ({start, totalCount, results}) => this.setState({objects: results, totalCount, promise: null}),
        err => this.setState({...INITIAL_STATE, err})
      );

    this.setState({promise});
  };

  handlePageChange = pageInfo => this.setState({pageInfo}, this.refresh);

  render() {
    const {objects, promise, totalCount, pageInfo} = this.state,
      {renderList} = this.props;

    return (
      <Loading loading={promise != null}>
        <span key="list">
          {renderList(objects)}
        </span>

        <span key="pagination">
          <Pagination totalCount={totalCount} value={pageInfo} onChange={this.handlePageChange}/>
        </span>
      </Loading>
    );
  }
}