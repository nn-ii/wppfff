import React, { Component } from "react";
import { castForEditing, commonGetDerivedStateFromProps } from "../../../Util";
import { debounce } from "throttle-debounce";

class InputSpace extends Component {
  constructor(props) {
    super();
    this.state = {
      version: 0,
      importantPropsSnapshot: { parentVersion: null }
    };

    this.callBackWhenInputSpaceActionDebounced = debounce(200, override => {
      this.props.callBackWhenInputSpaceAction(
        Object.assign({}, this.state, override)
      );
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let ret = commonGetDerivedStateFromProps(nextProps, prevState);
    if (ret === null) {
      /* null check is needed : typeof null will be 'object' */
      return null;
    } else if (typeof ret === "object") {
      return Object.assign(ret, {
        initialValue: castForEditing(nextProps.initialValue),
        value: castForEditing(nextProps.initialValue),
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
            let tmp = {
              value: e.target.value,
              changed: this.state.initialValue !== e.target.value
            };
            this.setState(tmp);
            this.callBackWhenInputSpaceActionDebounced(tmp);
          }}
        />
        {this.state.changed && " [Changed]"}
      </span>
    );
  }
}

export default InputSpace;
