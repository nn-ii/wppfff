import React, { Component } from "react";
import DataTable from "./Parts/DataTable";
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
    this.state = {
      tableRows: [],
      tableColumns: ["id", "xxxxxxxxxxxxxxxxxxxxxx", "editable", "input"],
      tableEditable: ["editable"],
      tableInputSpace: ["input"],
      variableHeight: 0,
      loading: false
    };
    this.variableHeightNode = React.createRef();

    //this.setVariableHeightStart();

    this.debugInsertDataToTable();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }
  debugInsertDataToTable() {
    /* inserting test */
    setTimeout(() => {
      let rows = [
        { data: ["ID0", 1091, "123456789123456789", "a"] },
        { nest: 1, data: ["ID1", 3, 4, null] }
      ];
      this.setState({ tableRows: rows });
    }, 1000);
    setTimeout(() => {
      let rows = [];
      rows.push({ nest: 0, data: ["ID0", 3, 4, 5] });

      let prevNest = 0;
      while (rows.length < 30) {
        let nest = getRandomInt(prevNest + 1);
        if (nest === prevNest) {
          nest = prevNest + 1;
        }
        rows.push({ nest: nest, data: ["ID" + rows.length, 3, 4, 5] });
        prevNest = nest;
      }
      this.setState({ tableRows: rows });
    }, 3000);
  }
  onSearch() {
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
        this.props.fromRoot.addMessage("Request error: search");
        this.setState({
          loading: false,
          tableRows: []
        });
      });
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
          {(() => {
            let list = [];
            for (let i = 0; i < 30; i++) {
              list.push(
                <span style={{ display: "inline-block", marginRight: "30px" }}>
                  ABCDEFG
                </span>
              );
            }
            return list;
          })()}

          <div style={{ display: "inline-block", marginBottom: "10px" }}>
            <a
              className="btn blue for-operation"
              onClick={() => this.onSearch()}
            >
              Search
            </a>
          </div>
        </div>
        {/*
        <div
          style={{
            height:
              Math.max(
                this.props.fromRoot.mainVisibleHeight - 130,
                tableAreaMinHeight
              ) + "px",
            width:
              Math.max(
                this.props.fromRoot.mainVisibleWidth - 40,
                tableAreaMinWidth
              ) + "px"
          }}
        >*/}
        <div
          style={{
            position: "absolute",
            height: "calc(100% - 190px)",
            width: "100%"
          }}
        >
          <DataTable
            rows={this.state.tableRows}
            columns={this.state.tableColumns}
            editable={this.state.tableEditable}
            inputSpace={this.state.tableInputSpace}
          />
        </div>
      </div>
    );
  }
}

export default Home;
