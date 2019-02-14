import React, { Component } from "react";
import { castForEditing, commonGetDerivedStateFromProps } from "../../Util";

class Editable extends Component {
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
        editing: false,
        changed: false
      });
    }
    return null;
  }

  render() {
    if (this.state.editing) {
      return (
        <span>
          <input
            type="text"
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
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
    this.setState({ editing: true });
  }
  onKeyPress(e) {
    if (e.key !== "Enter") {
      return;
    }
    this.whenFinish();
  }
  whenFinish() {
    this.setState({
      editing: false,
      changed: this.state.initialValue !== this.state.value
    });
  }
}

export default Editable;
