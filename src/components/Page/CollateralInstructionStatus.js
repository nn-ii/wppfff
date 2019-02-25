import React, { PureComponent } from "react";

import DataTable from "../Parts/DataTable";
import XStack from "../Parts/XStack";
import ClosableArea from "../Parts/ClosableArea";
import FormInput from "../Parts/Form/FormInput";
import FormSelect from "../Parts/Form/FormSelect";

import { getRandomInt, toggleState } from "../Util";

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

      showingClosableArea: true
    };

    this.setStateFunc = toSet => {
      this.setState(toSet);
    };

    this.toggleShowingClosableAreaFunc = () =>
      toggleState(this, "showingClosableArea");
  }
  render() {
    return (
      <React.Fragment>
        <h3 className="title">Collateral Instruction Status</h3>
        <ClosableArea
          title="Search Condition"
          closed={!this.state.showingClosableArea}
          whenToggleButtonClick={this.toggleShowingClosableAreaFunc}
        >
          <div id="searchForm">
            <div style={{ marginTop: "5px" }}>
              Request Date
              <FormInput
                name="requestDateStart"
                value={this.state.searchFormRequestDateStartValue}
                setParentStateFunc={this.setStateFunc}
                parentStateKey="searchFormRequestDateStart"
                validationFunc={v => v === "A"}
                isValid={this.state.searchFormRequestDateStartValid}
              />
              <span style={{ marginRight: "5px" }}>-</span>
              <FormInput
                name="requestDateEnd"
                value={this.state.searchFormRequestDateEndValue}
                setParentStateFunc={this.setStateFunc}
                parentStateKey="searchFormRequestDateEnd"
                validationFunc={v => v === "A"}
                isValid={this.state.searchFormRequestDateEndValid}
              />
            </div>
            <div style={{ marginTop: "5px" }}>
              Status
              <FormSelect
                name="requestDateStart"
                options={["A", "B"]}
                selected={this.state.searchFormStatusValue}
                setParentStateFunc={this.setStateFunc}
                parentStateKey="searchFormStatus"
              />
            </div>

            <XStack alignToRight={true} style={{ marginTop: "5px" }}>
              <a
                className="btn blue"
                name="search"
                onClick={() => {
                  console.log(
                    "searchFormCategory val/valid",
                    this.state.searchFormCategoryValue,
                    this.state.searchFormCategoryValid
                  );
                  this.setState({ searchFormCategory: "" });
                }}
              >
                Search
              </a>
            </XStack>
          </div>
        </ClosableArea>

        <h4 className="title">Detail Part</h4>
        <div
          style={{
            marginTop: "5px",
            height: `calc(100% - ${
              this.state.showingClosableArea ? 203 : 124
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
        <XStack alignToRight={true}>
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
      </React.Fragment>
    );
  }
}

export default CollateralInstructionStatus;
