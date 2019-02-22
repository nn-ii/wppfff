import React, { PureComponent } from "react";
import DataTable from "../Parts/DataTable";
import ToolTableCell from "../Parts/ToolTableCell";
import { getRandomInt } from "../Util";

class CollateralInstructionCash extends PureComponent {
  constructor() {
    super();
    let rows = [];
    while (rows.length < 30) {
      rows.push({
        data: [
          "" + rows.length,
          "" + getRandomInt(100),
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
      instructionSummaryColumns: [
        "Instruction Type",
        "Instruction Amount",
        "Currency"
      ],
      instructionSummaryRows: [{ data: ["", "0", "JPY"] }],

      rows: rows,
      columns: [
        "COLUMN COLUMN",
        "COLUMN COLUMN",
        "COLUMN COLUMN",
        "COLUMN COLUMN",
        "COLUMN COLUMN",
        "COLUMN COLUMN",
        "COLUMN COLUMN",
        "COLUMN COLUMN"
      ],
      tmpArray: [],

      showingChildScreen: false
    };
  }
  render() {
    return (
      <React.Fragment>
        <h3 className="title">Collateral Instruction - Cash</h3>
        <h4 className="title">Instruction Part</h4>
        <div
          style={{
            marginTop: "8px",
            width: "100%",
            height: "58px",
            fontSize: "12px",
            overflowY: "hidden"
          }}
        >
          <DataTable
            rows={this.state.instructionSummaryRows}
            columns={this.state.instructionSummaryColumns}
            editableIndices={this.state.tmpArray}
            inputSpaceIndices={this.state.tmpArray}
            sortableIndices={this.state.tmpArray}
            toggleEnabled={false}
            scrollable={false}
          />
        </div>
        <div>
          <h4 className="title">Detail Part</h4>
          <div
            style={{
              position: "absolute",
              left: "110px",
              top: "-6px",
              fontSize: "180%",
              fontWeight: "bold"
            }}
          >
            +
          </div>
          <div
            style={{
              position: "absolute",
              left: "130px",
              top: "-8px",
              fontSize: "180%",
              fontWeight: "bold"
            }}
          >
            -
          </div>
        </div>
        <div
          style={{
            marginTop: "8px",
            width: "100%",
            height: "calc(100% - 180px)",
            fontSize: "12px"
          }}
        >
          <DataTable
            rows={this.state.rows}
            columns={this.state.columns}
            editableIndices={this.state.tmpArray}
            inputSpaceIndices={this.state.tmpArray}
            sortableIndices={this.state.tmpArray}
            toggleEnabled={false}
          />
        </div>
        <div style={{ top: "5px", width: "100%" }}>
          {/*<div style={{ position: "absolute", right: "5px" }}>*/}
          <div style={{ float: "right" }}>
            <div
              style={{
                display: "inline-block",
                width: "15px",
                borderBottom: "1px solid",
                textAlign: "center",
                paddingBottom: "1px",
                marginRight: "7px"
              }}
            >
              ↑
            </div>
            <div
              style={{
                display: "inline-block",
                width: "15px",
                borderBottom: "1px solid",
                textAlign: "center",
                paddingBottom: "1px",
                marginRight: "7px"
              }}
            >
              ↓
            </div>
            <a className="btn green font-black wider1">Submit</a>
          </div>
          <div style={{ clear: "both" }} />
        </div>
      </React.Fragment>
    );
  }
}

export default CollateralInstructionCash;
