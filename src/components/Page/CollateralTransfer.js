import React, { PureComponent } from "react";

import DataTable from "../Parts/DataTable";
import Modal from "../Parts/Modal";
import XStack from "../Parts/XStack";
import XStackLeftRight from "../Parts/XStackLeftRight";

import { getRandomInt } from "../../Util";

class CollateralTransfer extends PureComponent {
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
        <XStackLeftRight
          leftChildren={
            <h3 className="title">Collateral Transfer Across Silo</h3>
          }
          rightChildren={
            <img
              style={{
                marginTop: "8px"
              }}
              alt=""
              src="https://uploads.codesandbox.io/uploads/user/b0e2d439-92ce-49c9-8acb-49d6d1c579a4/Yk09-reload.png"
            />
          }
        />

        <XStack style={{ height: "calc(100% - 60px)" }}>
          <div style={{ height: "100%", width: "calc(50% - 20px)" }}>
            <h4 className="title">Transfer From</h4>
            <div
              style={{
                height: "calc(50% - 40px)"
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
            <XStack>
              <h4 className="title" style={{ marginTop: "13px" }}>
                Transfer To
              </h4>
              <img
                style={{
                  marginTop: "5px",
                  marginLeft: "20%"
                }}
                alt=""
                src="https://uploads.codesandbox.io/uploads/user/b0e2d439-92ce-49c9-8acb-49d6d1c579a4/34ng-triangle.png"
              />
            </XStack>
            <div
              style={{
                marginTop: "5px",
                height: "calc(50% - 40px)"
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
          </div>
          <div
            className="y-stack"
            style={{
              marginLeft: "10px",
              width: "calc(50% - 20px)",
              height: "calc(100% - 20px)"
            }}
          >
            <h4 className="title">Transfer From (Detail)</h4>
            <div
              style={{
                height: "calc(100% - 35px)"
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
          </div>
        </XStack>
        <XStack alignToRight={true} style={{ marginTop: "2px" }}>
          <a className="btn blue wider1">Input Amount</a>
        </XStack>

        {this.state.showingChildScreen && <Modal title="AAAA" />}
      </React.Fragment>
    );
  }
}

export default CollateralTransfer;
