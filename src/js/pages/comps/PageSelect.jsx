import React, {DOM, PropTypes, Component, PureComponent} from "react";
import cx from "classnames";
import _ from "underscore";

export class Page extends PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func
  };

  doNothing = e => e.preventDefault();

  handleClick = (e) => {
    window.scrollTo(0, 0);
    this.props.onClick(e);
  };

  render() {
    const {active, disabled, onClick, children, ...rest} = this.props;

    return (
      <li onClick={disabled ? null : this.handleClick} className={cx({active, disabled})} {...rest}>
        <a href="#" onClick={this.doNothing}>
          {children}
        </a>
      </li>
    );
  }
}

const Prev = (props) => <Page {...props}><i className="fa fa-chevron-left"/></Page>,
  Next = (props) => <Page {...props}><i className="fa fa-chevron-right"/></Page>;


export default class PageSelect extends PureComponent {
  static propTypes = {
    numPages: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {};

  handleSelectPage = pageNo => {
    const {onChange, numPages} = this.props;

    onChange(Math.min(Math.max(pageNo, 0), numPages));
  };

  handlePrev = () => this.handleSelectPage(this.props.value - 1);
  handleNext = () => this.handleSelectPage(this.props.value + 1);

  render() {
    const {value, numPages, onChange, className, ...rest} = this.props;

    return (
      <ul className={cx(className, 'pagination')} {...rest}>
        <Prev key="prev" disabled={value == 0} onClick={this.handlePrev}/>
        {
          _.range(0, numPages)
            .map(page => {
              return (
                <Page key={page} onClick={() => this.handleSelectPage(page)} active={page == value}>
                  {page}
                </Page>
              );
            })
        }
        <Next key="next" disabled={value == numPages - 1} onClick={this.handleNext}/>
      </ul>
    );
  }
}