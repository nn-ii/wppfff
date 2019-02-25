import React from "react";

const XStackLeftRight = props => {
  return (
    <div className="x-stack-lr" style={props.style}>
      <div className="left-part">
        {props.leftChildren}
        <div className="clear" />
      </div>
      <div className="right-part">
        {props.rightChildren}
        <div className="clear" />
      </div>
      <div className="clear" />
    </div>
  );
};

export default XStackLeftRight;
