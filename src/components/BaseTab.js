import React, { Component } from "react";

class BaseTab extends Component {
  constructor() {
    super();
    this.state = { openIndex: 0 };
    this.tabs = [];
  }
  render() {
    var eachTabWidth = `calc(100%/${this.tabs.length} - 2px)`;

    var eachWithIndex = (ary, func) => {
      var cnt = 0;
      return ary.map(i => {
        return func(i, cnt++);
      });
    };

    return (
      <div style={{ width: "100%" }}>
        {/* tab bar */}
        <div style={{ width: "100%" }}>
          {eachWithIndex(this.tabs, (tabSetting, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  this.setState({ openIndex: index });
                }}
                style={{
                  float: "left",
                  width: eachTabWidth,
                  textAlign: "center",
                  backgroundColor:
                    index === this.state.openIndex ? "blue" : "skyblue",
                  borderRight: "solid 1px",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                {tabSetting.name}
              </div>
            );
          })}
        </div>

        {/* content area */}
        <div style={{ width: "100%" }}>
          {this.tabs[this.state.openIndex].content}
        </div>
      </div>
    );
  }
}

export default BaseTab;
