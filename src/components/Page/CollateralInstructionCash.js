import React, { PureComponent } from "react";

import DataTable from "../Parts/DataTable";
import Modal from "../Parts/Modal";
import XStack from "../Parts/XStack";
import FormSelect from "../Parts/Form/FormSelect";

import { getRandomInt } from "../../Util";

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

    this.setStateFunc = toSet => {
      this.setState(toSet);
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
            height: "58px",
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
        <XStack>
          <h4 className="title">Detail Part</h4>
          <div
            style={{
              marginTop: "2px",
              marginLeft: "100px",
              fontSize: "180%",
              fontWeight: "bold"
            }}
            onClick={() => {
              this.setState({ showingChildScreen: true });
            }}
          >
            +
          </div>
          <div
            style={{
              marginLeft: "10px",
              fontSize: "180%",
              fontWeight: "bold",
              color: "gray"
            }}
          >
            -
          </div>
        </XStack>
        <div
          style={{
            marginTop: "5px",
            height: "calc(100% - 185px)"
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

        {this.state.showingChildScreen && (
          <Modal title="Instruction Part">
            <div>
              <table className="in-modal-type-a" id="addDepositForm">
                <tbody>
                  <tr>
                    <td>Collateral Type</td>
                    <td>
                      <FormSelect
                        name="collateralType"
                        options={["AAAA", "BBBB"]}
                        selected={this.state.addDepositFormCollateralTypeValue}
                        setParentStateFunc={this.setStateFunc}
                        parentStateKey="addDepositFormCollateralType"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Deposit Type</td>
                    <td>
                      <FormSelect
                        name="depositType"
                        options={["AAAA", "BBBB"]}
                        selected={this.state.addDepositFormDepositTypeValue}
                        setParentStateFunc={this.setStateFunc}
                        parentStateKey="addDepositFormDepositType"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <XStack alignToRight={true} style={{ marginTop: "3px" }}>
                <a className="btn blue">AAAAA</a>
                <a
                  style={{ marginLeft: "5px" }}
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

export default CollateralInstructionCash;
