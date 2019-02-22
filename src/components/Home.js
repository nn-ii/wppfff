import React, { PureComponent } from "react";
import DataTable from "./Parts/DataTable";
import FormSelect from "./Parts/FormSelect";
import Modal from "./Parts/Modal";
import XStack from "./Parts/XStack";

import {
  getRandomInt,
  retryWithWait,
  withoutPx,
  runWithInterval
} from "./Util";
import axios from "axios";

class Home extends PureComponent {
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
      variableHeight: 0,
      loading: false,
      errorMessage: null
    };
    this.variableHeightNode = React.createRef();

    //this.setVariableHeightStart();

    [
      "onSearch",
      "formSelectAAAAOnChange",
      "whenEditableAction",
      "whenInputSpaceAction"
    ].forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });

    /* for testing */
    setTimeout(() => this.debugInsertDataToTable(10), 0);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }
  componentWillUnmount() {
    this.setVariableHeightController &&
      this.setVariableHeightController.clear();
  }
  onSearch(event) {
    event.preventDefault();

    let url =
      Math.random() > 0.5
        ? "https://reqres.in/api/users" /* will success */
        : "https://reqres.in/api/xxxx/9999"; /* will 404 */

    this.setState({ loading: true });
    axios
      .get(url)
      .then(response => {
        console.log("Axios request successful", response);
        this.setState({
          loading: false,
          tableRows: response.data.data.map(item => {
            return {
              data: ["" + item.id, item.first_name, item.last_name, ""]
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
  formSelectAAAAOnChange(e) {
    if (e.target.value === this.state.formSelectAAAAValue) {
      return;
    }

    let stateToSet = { formSelectAAAAValue: e.target.value };
    if (e.target.value === "All") {
      stateToSet.formSelectBBBBOptions = ["All"];
      stateToSet.formSelectBBBBValue = "All";
    } else if (e.target.value === "House") {
      stateToSet.formSelectBBBBOptions = [{ value: "nothing", text: "-" }];
      stateToSet.formSelectBBBBValue = "nothing";
    } else if (e.target.value === "Affiliate") {
      stateToSet.formSelectBBBBOptions = ["All", "Affiliate X", "Affiliate Y"];
      stateToSet.formSelectBBBBValue = "All";
    } else if (e.target.value === "Client") {
      stateToSet.formSelectBBBBOptions = ["All", "Client X", "Client Y"];
      stateToSet.formSelectBBBBValue = "All";
    }

    this.setState(stateToSet);
  }
  setVariableHeightStart() {
    this.setVariableHeightController = runWithInterval(500, resolve => {
      retryWithWait(50, 500, () =>
        document.defaultView.getComputedStyle(this.variableHeightNode.current)
      ).then(style => {
        let currentVariableHeight = withoutPx(style.height) - 20;
        if (this.state.variableHeight !== currentVariableHeight) {
          this.setState({
            variableHeight: currentVariableHeight
          });
        }

        resolve();
      });
    });
  }
  whenEditableAction(rowIndex, colIndex, summary) {
    console.log("whenEditableAction", rowIndex, colIndex, summary);
  }
  whenInputSpaceAction(rowIndex, colIndex, summary) {
    console.log("whenInputSpaceAction", rowIndex, colIndex, summary);
  }

  render() {
    let wholeMinHeight = 200;
    let tableMinHeight = 250;

    return (
      <React.Fragment>
        <div
          className="loading-screen"
          style={{ display: this.state.loading || "none" }}
        />
        <h4 style={{ marginTop: "5px", marginBottom: "5px" }}>Hello Browser</h4>

        <div
          style={{
            height: "70px",
            width: "100%",
            border: "1px solid black",
            overflowWrap: "break-word",
            paddingTop: "5px",
            paddingLeft: "5px"
          }}
        >
          <label style={{ marginRight: "10px" }}>
            AAAA:
            <FormSelect
              options={[
                { value: "All", text: "All " },
                "House",
                "Affiliate",
                "Client"
              ]}
              callbackOnChange={this.formSelectAAAAOnChange}
              selectedItem={
                typeof this.state.formSelectAAAAValue === "string"
                  ? this.state.formSelectAAAAValue
                  : "All"
              }
            />
          </label>
          <label>
            BBBB:
            <FormSelect
              options={this.state.formSelectBBBBOptions || ["All"]}
              callbackOnChange={e =>
                this.setState({ formSelectBBBBValue: e.target.value })
              }
              selectedItem={this.state.formSelectBBBBValue || "All"}
            />
          </label>
          <a
            className="btn blue for-operation"
            style={{ marginLeft: "10px" }}
            onClick={this.onSearch}
          >
            Search
          </a>

          <label style={{ marginLeft: "20px" }}>
            Count:
            <input
              value={this.state.formCountValue || ""}
              onChange={e => {
                this.setState({
                  formCountValue: e.target.value,
                  formCountValidity:
                    e.target.value.match(/^\d+$/) && e.target.value <= 3000
                });
              }}
            />
          </label>

          <a
            className={
              "btn blue for-operation" +
              (this.state.formCountValidity ? "" : " disabled")
            }
            style={{ marginLeft: "10px" }}
            onClick={() => {
              this.debugInsertDataToTable(this.state.formCountValue);
            }}
          >
            Test Load
          </a>
        </div>
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
        <div style={{ position: "relative", marginTop: "8px", width: "100%" }}>
          <div style={{ position: "absolute", right: "5px" }}>
            <a
              className={"btn blue for-operation"}
              onClick={() => {
                alert("AAA");
              }}
            >
              AAA
            </a>{" "}
            <a
              className={"btn blue for-operation"}
              onClick={() => {
                alert("AAA");
              }}
            >
              BBB
            </a>
          </div>
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

export default Home;
