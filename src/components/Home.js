import React, { Component } from "react";
import DataTable from "./Parts/DataTable";
import FormSelect from "./Parts/FormSelect";
import Modal from "./Parts/Modal";
import {
  getRandomInt,
  retryWithWait,
  withoutPx,
  runWithInterval
} from "./Util";
import axios from "axios";

class Home extends Component {
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
      "random2"
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

    this.debugInsertDataToTable();

    [
      "onSearch",
      "formSelectAAAAOnChange",
      "whenEditableAction",
      "whenInputSpaceAction"
    ].forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
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
        //this.props.fromRoot.addMessage("Request error: search");
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
      <div
        style={{
          height:
            Math.max(this.props.fromRoot.mainVisibleHeight, wholeMinHeight) +
            "px"
        }}
      >
        <div
          className="loading-screen"
          style={{ display: this.state.loading || "none" }}
        />
        <h4 style={{ marginTop: "5px", marginBottom: "5px" }}>Hello Browser</h4>

        <div
          style={{
            height: "130px",
            border: "1px solid black",
            overflowWrap: "break-word"
          }}
        >
          <form>
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
              style={{ position: "relative", top: "80px" }}
              onClick={this.onSearch}
            >
              Search
            </a>
          </form>
        </div>
        <div
          style={{
            position: "absolute",
            height: "calc(100% - 185px)",
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
      </div>
    );
  }
  debugInsertDataToTable() {
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
    setTimeout(() => {
      let rows = [];

      let isFirst = true;
      let prevNest = 0;
      while (rows.length < 30) {
        let nest = getRandomInt(prevNest + 1);
        if (nest === prevNest) {
          nest = prevNest + 1;
        }
        rows.push({
          nest: isFirst ? 0 : nest,
          data: [
            "ID" + rows.length,
            3,
            4,
            5,
            getRandomInt(100),
            getRandomInt(100),
            getRandomInt(100)
          ]
        });
        prevNest = nest;
        isFirst = false;
      }
      this.setState({ tableRows: rows });
    }, 600);
  }
}

export default Home;
