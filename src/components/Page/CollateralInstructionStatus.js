import React, { PureComponent } from "react";

import DataTable from "../Parts/DataTable";
import Modal from "../Parts/Modal";
import XStack from "../Parts/XStack";

import { getRandomInt } from "../Util";

class CollateralInstructionStatus extends PureComponent {
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

      showingSearchCondition: true,
      showingChildScreen: false
    };
  }
  render() {
    return (
      <React.Fragment>
        <div className="y-stack">
          <h3 className="title">Collateral Instruction Status</h3>
          <div style={{ border: "solid 1px gray" }}>
            <XStack style={{ backgroundColor: "lightgray" }}>
              <div style={{ float: "left" }}>Search Condition</div>
              <div
                style={{ float: "left", marginLeft: "15px" }}
                onClick={() => {
                  this.setState({
                    showingSearchCondition: !this.state.showingSearchCondition
                  });
                }}
              >
                ↓
              </div>
            </XStack>
            <div
              style={{
                display: this.state.showingSearchCondition ? undefined : "none",
                height: "50px"
              }}
            >
              <div>AAA BBB</div>
              <div>CCC DDD</div>
            </div>
          </div>

          <h4 className="title">Detail Part</h4>
          <div
            style={{
              marginTop: "5px",
              height: `calc(100% - ${
                this.state.showingSearchCondition ? 185 : 135
              }px)`
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
          <XStack alignToRight={true} style={{ marginTop: "7px" }}>
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
          </XStack>
        </div>

        {this.state.showingChildScreen && (
          <Modal title="Instruction Part">
            <div className="y-stack">
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "right" }}>XXXX</td>
                      <td>XXXXX</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: "right" }}>1111111XXXX</td>
                      <td>XXXXX123</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <XStack alignToRight={true} style={{ marginTop: "3px" }}>
                <a style={{ float: "left" }} className="btn blue">
                  AAAAA
                </a>
                <a
                  style={{ float: "left", marginLeft: "5px" }}
                  className="btn blue"
                  onClick={() => this.setState({ showingChildScreen: false })}
                >
                  Cancel
                </a>
              </XStack>
            </div>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default CollateralInstructionStatus;
