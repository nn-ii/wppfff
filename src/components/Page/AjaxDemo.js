import React, { PureComponent } from "react";
import DataTable from "../Parts/DataTable";
import FormInput from "../Parts/Form/FormInput";
import FormSelect from "../Parts/Form/FormSelect";
import Modal from "../Parts/Modal";
import ClosableArea from "../Parts/ClosableArea";

import {
  getRandomInt,
  toggleState,
  downloadAsCsv,
  retryWithWait,
  withoutPx,
  runWithInterval
} from "../../Util";
import axios from "axios";

class AjaxDemo extends PureComponent {
  constructor() {
    super();

    this.ConstTableColumns = [
      "id",
      {
        value: "AAA",
        children: [
          { id: "PPPPInput", value: "PPPP" },
          { id: "PPPPSort", value: "PPPP" },
          "PPPP"
        ]
      },
      "editable",
      "random1",
      "random2",
      { id: "random3", value: "random3________________________" }
    ];
    this.ConstTableEditableIndices = ["editable"];
    this.ConstTableInputSpaceIndices = ["PPPPInput"];
    this.ConstTableSortableIndices = ["random1", "random2", "PPPPSort"];

    this.state = {
      tableRows: [],
      loading: false,
      errorMessage: null,
      showingClosableArea: true
    };

    this.setStateFunc = toSet => {
      this.setState(toSet);
    };
    this.toggleShowingClosableAreaFunc = () =>
      toggleState(this, "showingClosableArea");

    [
      "onSearch",
      "onCsvDownload",
      "searchFormSecondLayerTypeOnChange",
      "whenEditableAction",
      "whenInputSpaceAction"
    ].forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });

    /* for testing */
    setTimeout(() => this.debugInsertDataToTable(10), 1);
  }
  onCsvDownload() {
    if (!this.state.dummyFormCsvDownloadCountValid) {
      return;
    }

    let data = [];
    for (let i = 0; i < this.state.dummyFormCsvDownloadCountValue; i++) {
      data.push([`${i}`, "AAA", "BBB, Ltd", "CCC"]);
    }

    downloadAsCsv("demo.csv", data);
  }
  onSearch(event) {
    let url =
      Math.random() > 0.5
        ? "https://reqres.in/api/users" /* will success */
        : "https://reqres.in/api/xxxx/9999"; /* will 404 error */

    this.setState({ loading: true });
    axios
      .get(url)
      .then(response => {
        this.setState({
          loading: false,
          tableRows: response.data.data.map(item => {
            return {
              data: ["" + item.id, item.first_name, item.last_name]
            };
          })
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          tableRows: [],
          errorMessage: "Search request error"
        });
      });
  }
  searchFormSecondLayerTypeOnChange(toSet) {
    if (
      toSet.searchFormSecondLayerTypeValue ===
      this.state.searchFormSecondLayerTypeValue
    ) {
      return;
    }

    if (toSet.searchFormSecondLayerTypeValue === "All") {
      toSet.searchFormSecondLayerNameOptions = undefined;
      toSet.searchFormSecondLayerNameValue = undefined;
    } else if (toSet.searchFormSecondLayerTypeValue === "House") {
      toSet.searchFormSecondLayerNameOptions = [
        { value: "nothing", text: "(House)" }
      ];
      toSet.searchFormSecondLayerNameValue = "nothing";
    } else if (toSet.searchFormSecondLayerTypeValue === "Affiliate") {
      toSet.searchFormSecondLayerNameOptions = [
        "All",
        "Affiliate X",
        "Affiliate Y"
      ];
      toSet.searchFormSecondLayerNameValue = "All";
    } else if (toSet.searchFormSecondLayerTypeValue === "Client") {
      toSet.searchFormSecondLayerNameOptions = ["All", "Client X", "Client Y"];
      toSet.searchFormSecondLayerNameValue = "All";
    }

    this.setState(toSet);
  }
  whenEditableAction(rowIndex, colIndex, summary) {
    console.log("whenEditableAction", rowIndex, colIndex, summary);
  }
  whenInputSpaceAction(rowIndex, colIndex, summary) {
    console.log("whenInputSpaceAction", rowIndex, colIndex, summary);
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="loading-screen"
          style={{ display: this.state.loading || "none" }}
        />
        <h4 style={{ marginTop: "5px", marginBottom: "5px" }}>
          Demo: Ajax and Filtered select box
        </h4>

        <ClosableArea
          title="Search Condition"
          closed={!this.state.showingClosableArea}
          whenToggleButtonClick={this.toggleShowingClosableAreaFunc}
        >
          <div id="searchForm">
            <label style={{ marginRight: "10px" }}>
              2nd Layer Type:
              <FormSelect
                name="secondLayerType"
                options={["All", "House", "Affiliate", "Client"]}
                setParentStateFunc={this.searchFormSecondLayerTypeOnChange}
                selected={this.state.searchFormSecondLayerTypeValue}
                parentStateKey="searchFormSecondLayerType"
              />
            </label>
            <label>
              2nd Layer:
              <FormSelect
                name="secondLayerName"
                options={this.state.searchFormSecondLayerNameOptions || ["All"]}
                selected={this.state.searchFormSecondLayerNameValue || "All"}
                setParentStateFunc={this.setStateFunc}
                parentStateKey="searchFormSecondLayerName"
              />
            </label>
            <a
              className="btn blue"
              style={{ marginLeft: "10px" }}
              onClick={this.onSearch}
            >
              Search
            </a>
            <FormInput
              name="csvDownloadCount"
              value={this.state.dummyFormCsvDownloadCountValue}
              setParentStateFunc={this.setStateFunc}
              parentStateKey="dummyFormCsvDownloadCount"
              validationFunc={v => /^[0-9]*$/.test(v)}
              isValid={this.state.dummyFormCsvDownloadCountValid}
              style={{ marginLeft: "10px" }}
            />

            <a
              className="btn blue"
              style={{ marginLeft: "1px" }}
              onClick={this.onCsvDownload}
            >
              CSV Download Demo
            </a>
          </div>
        </ClosableArea>
        <div
          style={{
            position: "relative",
            marginTop: "10px",
            height: "calc(100% - 150px)",
            width: "100%"
          }}
        >
          <DataTable
            rows={this.state.tableRows}
            columns={this.ConstTableColumns}
            editableIndices={this.ConstTableEditableIndices}
            inputSpaceIndices={this.ConstTableInputSpaceIndices}
            sortableIndices={this.ConstTableSortableIndices}
            callBackWhenEditableAction={this.whenEditableAction}
            callBackWhenInputSpaceAction={this.whenInputSpaceAction}
          />
        </div>

        {this.state.errorMessage && (
          <Modal
            title="Error"
            content={
              <div>
                {this.state.errorMessage}
                <button onClick={() => this.setState({ errorMessage: null })}>
                  Close
                </button>
              </div>
            }
          />
        )}
      </React.Fragment>
    );
  }
  debugInsertDataToTable(count) {
    /* inserting test */
    /*
    setTimeout(() => {
      let rows = [
        { data: ["ID0", 1091, "123456789123456789", "a"] },
        { nest: 1, data: ["ID1", 3, 4, null] }
      ];
      this.setState({ tableRows: rows });
    }, 500);
    */
    let rows = [];

    let isFirst = true;
    let prevNest = 0;
    while (rows.length < count) {
      let nest = Math.min(getRandomInt(prevNest + 1 + 3), prevNest + 1, 4);
      rows.push({
        nest: isFirst ? 0 : nest,
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
      prevNest = nest;
      isFirst = false;
    }
    this.setState({ tableRows: rows });
  }
}

export default AjaxDemo;
