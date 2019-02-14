import React, { Component } from "react";
import { castForEditing, commonGetDerivedStateFromProps } from "../../Util";

class InputSpace extends React.Component {
  constructor(props) {
    super();
    this.state = {
      version: 0,
      importantPropsSnapshot: { parentVersion: null }
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let ret = commonGetDerivedStateFromProps(nextProps, prevState);
    if (ret === null) {
      /* null check is needed : typeof null will be 'object' */
      return null;
    } else if (typeof ret === "object") {
      return Object.assign(ret, {
        value: castForEditing(nextProps.initialValue),
        initialValue: castForEditing(nextProps.initialValue),
        changed: false
      });
    }
    return null;
  }
  render() {
    return (
      <span>
        <input
          type="text"
          value={this.state.value}
          onChange={e => {
            this.setState({
              value: e.target.value,
              changed: this.state.initialValue !== e.target.value
            });
          }}
        />
        {this.state.changed && " [Changed]"}
      </span>
    );
  }
}

export default InputSpace;
