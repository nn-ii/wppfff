import React, { PureComponent } from "react";
import XStack from "./XStack";

class ClosableArea extends PureComponent {
  render() {
    return (
      <div style={{ border: "solid 1px lightgray" }}>
        <XStack style={{ backgroundColor: "lightgray" }}>
          <div style={{ margin: "3px 0 3px 3px" }}>{this.props.title}</div>
          <div
            style={{ marginLeft: "20px" }}
            onClick={this.props.whenToggleButtonClick}
          >
            ↓
          </div>
        </XStack>
        <div
          style={{
            padding: "3px",
            display: this.props.closed ? "none" : undefined
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default ClosableArea;
