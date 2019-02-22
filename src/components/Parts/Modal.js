import React, { Component } from "react";
import ToolTableCell from "./ToolTableCell";

class Modal extends Component {
  constructor() {
    super();
    this.state = {};
    this.tabs = [];
  }
  render() {
    return (
      <div className="modal-root">
        <div className="modal-back" />

        <div className="modal-area ">
          <div className="modal-title">{this.props.title}</div>
          <div className="modal-main-frame">
            <div className="modal-main">
              {this.props.content ? this.props.content : this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
