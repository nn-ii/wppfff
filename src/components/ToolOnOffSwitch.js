import React from "react";

const ToolOnOffSwitch = props => (
  <div className={`switch-area ${props.on && "on"}`} onClick={props.onClick}>
    <span>{props.on ? "ON" : "OFF"}</span>
    <div />
  </div>
);

export default ToolOnOffSwitch;
