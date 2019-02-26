import React, { Component } from "react";
import { castForEditing, commonGetDerivedStateFromProps } from "../../../Util";

class Editable extends Component {
  constructor(props) {
    super();
    this.state = {
      version: 0,
      importantPropsSnapshot: { parentVersion: null }
    };
    this.inputRef = null;
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
        editing: false,
        changed: false
      });
    }
    return null;
  }

  render() {
    if (this.state.editing) {
      this.inputRef = this.inputRef || React.createRef();
      return (
        <span>
          <input
            type="text"
            defaultValue={this.state.value}
            ref={this.inputRef}
            onKeyPress={e => this.onKeyPress(e)}
          />
          <button
            style={{ display: "inline" }}
            onClick={() => {
              this.whenFinish();
            }}
          >
            ✓
          </button>
        </span>
      );
    } else {
      return (
        <span>
          {this.state.value} {this.state.changed && " [Changed]"}
          <button
            onClick={() => {
              this.startEdit();
            }}
          >
            ::
          </button>
        </span>
      );
    }
  }
  startEdit() {
    let tmp = { editing: true };
    this.setState(tmp);
    console.log("startEdit", this.props);
    this.props.callBackWhenEditableAction(Object.assign({}, this.state, tmp));
  }
  onKeyPress(e) {
    if (e.key !== "Enter") {
      return;
    }
    this.whenFinish();
  }
  whenFinish() {
    let value = this.inputRef.current.value;
    let tmp = {
      editing: false,
      value: value,
      changed: this.state.initialValue !== value
    };
    this.setState(tmp);
    this.props.callBackWhenEditableAction(Object.assign({}, this.state, tmp));
  }
}

export default Editable;
