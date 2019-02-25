import React from "react";

const XStack = props => {
  if (props.alignToRight) {
    return (
      <div className="x-stack-wrapper" style={props.style}>
        <div className="float-right">
          <div className="x-stack">
            {props.children}
            <div className="clear" />
          </div>
        </div>
        <div className="clear" />
      </div>
    );
  } else {
    return (
      <div className="x-stack" style={props.style}>
        {props.children}
        <div className="clear" />
      </div>
    );
  }
};

export default XStack;
