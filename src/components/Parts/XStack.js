import React from "react";

const XStack = props => {
  if (props.alignToRight) {
    return (
      <div className="x-stack-wrapper" style={props.style}>
        <div style={{ float: "right" }}>
          <div className="x-stack">
            {props.children}
            <div style={{ clear: "both" }} />
          </div>
        </div>
        <div style={{ clear: "both" }} />
      </div>
    );
  } else {
    return (
      <div className="x-stack" style={props.style}>
        {props.children}
        <div style={{ clear: "both" }} />
      </div>
    );
  }
};

export default XStack;
