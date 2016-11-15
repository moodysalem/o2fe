import React from "react";
import CSSTransitionGroup from "react-addons-css-transition-group";

export const SlideRight = (props) => (
  <CSSTransitionGroup
    transitionName="slide-right"
    transitionAppearTimeout={300}
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
    {...props}
  />
);

export const SlideDown = (props) => (
  <CSSTransitionGroup
    transitionName="slide-down"
    transitionAppearTimeout={300}
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
    {...props}
  />
);


export const SlideUp = (props) => (
  <CSSTransitionGroup
    transitionName="slide-up"
    transitionAppearTimeout={300}
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
    {...props}
  />
);

export const Fade = (props) => (
  <CSSTransitionGroup
    transitionName="fade"
    transitionAppearTimeout={300}
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
    {...props}
  />
);

export const ZoomIn = props => (
  <CSSTransitionGroup
    transitionName="zoom-in"
    transitionAppearTimeout={300}
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
    {...props}
  />
);