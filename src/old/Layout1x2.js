import React, { PureComponent } from "react";
import DataTable from "../Parts/DataTable";
import { getRandomInt } from "../Util";

class Layout1x2 extends PureComponent {
  constructor() {
    super();
    let rows = [];
    while (rows.length < 30) {
      rows.push({
        data: [
          "ID" + rows.length,
          "edi" + getRandomInt(100),
          "XXX" + getRandomInt(100),
          "aaa",
          getRandomInt(100),
          getRandomInt(100),
          getRandomInt(100),
          getRandomInt(10)
        ]
      });
    }

    /* START initial state setup */
    this.state = {
      rows,
      columns: ["AAA", "BBB", "CCC", "DDD", "EEE", "FFF", "GGG", "HHH"],
      tmpArray: []
    };
  }
  render() {
    return (
      <React.Fragment>
        <h4 style={{ marginTop: "5px", marginBottom: "5px" }}>Layout1x2</h4>
        <div
          style={{
            position: "relative",
            marginTop: "10px",
            height: "calc(100% - 150px)",
            width: "100%"
          }}
        >
          <div style={{ display: "inline-block", width: "30%", height: "70%" }}>
            <DataTable
              rows={this.state.rows}
              columns={this.state.columns}
              editableIndices={this.state.tmpArray}
              inputSpaceIndices={this.state.tmpArray}
              sortableIndices={this.state.tmpArray}
            />
          </div>
          <div
            style={{
              display: "inline-block",
              marginLeft: "15px",
              width: "60%",
              height: "70%"
            }}
          >
            <DataTable
              rows={this.state.rows}
              columns={this.state.columns}
              editableIndices={this.state.tmpArray}
              inputSpaceIndices={this.state.tmpArray}
              sortableIndices={this.state.tmpArray}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Layout1x2;
