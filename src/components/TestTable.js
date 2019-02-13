import React, { Component } from "react";
import { throttle, debounce } from "throttle-debounce";
import {
  eachWithIndex,
  commonGetDerivedStateFromProps,
  withoutPx,
  cloneObjectSimple,
  castForEditing,
  retryWithWait,
  runWithInterval
} from "./Util";

class TestTable extends Component {
  constructor() {
    super();

    /* START initial state setup */
    this.state = {
      /* for rendering */
      scrollTop: 0,

      /* for adjust fixed height */
      lockForAdjustFixedHeight: false,

      /* below will be calculated */
      editableIndex: [],
      inputSpaceIndex: [],

      /* used in commonGetDerivedStateFromProps */
      version: 0,
      importantPropsSnapshot: {
        rows: null,
        columns: null,
        editableIndex: null,
        inputSpaceIndex: null
      }
    };
    /* END initial state setup */

    /* used for adjustFixedHeight */
    this.adjustFixedHeightStartedVersion = -1;

    /* needed to realize both horizontal and vertical scroll with sticky header row*/
    this.scrollableNode = React.createRef();

    /* needed to fix height of inner content */
    this.flexibleInnerNode = React.createRef();

    this.scrollDebounce = debounce(200, () => {
      this.setState({
        scrollTop: this.scrollableNode.current.scrollTop
      });
    });
    this.adjustHeaderCellsWidthThrottle = throttle(60, () => {
      this.adjustHeaderCellsWidth();
    });

    this.debugStartDate = new Date();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let ret = commonGetDerivedStateFromProps(nextProps, prevState);
    if (ret === null) {
      /* null check is needed : typeof null will be 'object' */
      return null;
    } else if (typeof ret === "object") {
      return Object.assign(ret, {
        closedParent: {},
        fixedHeight: null,
        headerWidthList: [],
        lockForAdjustFixedHeight: true,

        /* normally can use `this` insetead of self class name in static methods,
         but here can't probably because there is React restriction or so */
        editableIndex: TestTable.createEditableIndex(nextProps),
        inputSpaceIndex: TestTable.createInputSpaceIndex(nextProps)
      });
    }
    return null;
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    this.adjustHeaderCellsWidthThrottle();
    if (this.state.lockForAdjustFixedHeight) {
      this.adjustFixedHeight();
    }
  }
  debugTime() {
    let cur = new Date();
    return cur.getTime() - this.debugStartDate.getTime();
  }

  debugCurrent(msg) {
    console.log(
      msg,
      this.debugTime(),
      (this.props.rows || []).length,
      this.heightBeforeRender
    );
  }

  static createEditableIndex = props => {
    let ret = [];
    for (let i = 0; i < props.columns.length; i++) {
      if (props.editable.includes(props.columns[i])) {
        ret.push(i);
      }
    }
    return ret;
  };
  static createInputSpaceIndex = props => {
    let ret = [];
    for (let i = 0; i < props.columns.length; i++) {
      if (props.inputSpace.includes(props.columns[i])) {
        ret.push(i);
      }
    }
    return ret;
  };

  toggleTree(row_i) {
    /* if using babel-polyfill, we can use Object.assign */
    let closedParent = cloneObjectSimple(this.state.closedParent);

    if (row_i in closedParent) {
      delete closedParent[row_i];
    } else {
      closedParent[row_i] = true;
    }
    this.setState({ closedParent });
  }

  adjustHeaderCellsWidth() {
    let cells = document.getElementsByClassName("header-column");
    let tableFirstTr = document.querySelector(".info-table tbody tr");
    let tableFirstRowTds = tableFirstTr.getElementsByTagName("td");

    let changed = false;
    let widthIntegers = [];
    for (let i = 0; i < cells.length; i++) {
      widthIntegers[i] = this.calculateWidthToSet(
        tableFirstRowTds[i],
        cells[i]
      );
      if (this.state.headerWidthList[i] !== widthIntegers[i]) {
        changed = true;
      }
    }

    /* if do not check `changed` and always do this.setState, then
      for each time componentDidUpdate() is called, and it call adjustHeaderCellsWidth ...
      => infinite loop */
    if (changed) {
      this.setState({ headerWidthList: widthIntegers });
    }
  }

  calculateWidthToSet(origElm, targetElm) {
    let origStyle = document.defaultView.getComputedStyle(origElm);
    let targetStyle = document.defaultView.getComputedStyle(targetElm);

    /* border-left + padding-left + width + padding-right */
    let origGeneralWidth = withoutPx(origStyle.borderLeftWidth);
    origGeneralWidth += withoutPx(origStyle.paddingLeft);
    origGeneralWidth += withoutPx(origStyle.width);
    origGeneralWidth += withoutPx(origStyle.paddingRight);

    let targetWithoutCoreWidth = withoutPx(targetStyle.borderLeftWidth);
    targetWithoutCoreWidth += withoutPx(targetStyle.paddingLeft);
    targetWithoutCoreWidth += withoutPx(targetStyle.paddingRight);

    return origGeneralWidth - targetWithoutCoreWidth;
  }

  getFlexibleInnerNodeHeight() {
    //console.log(this.flexibleInnerNode.current);

    return withoutPx(
      document.defaultView.getComputedStyle(this.flexibleInnerNode.current)
        .height
    );
  }

  adjustFixedHeight() {
    if (this.adjustFixedHeightStartedVersion >= this.state.version) {
      return;
    }

    this.adjustFixedHeightStartedVersion = this.state.version;
    let versionWhenStarted = this.state.version;

    let monitorController;
    let debounced = debounce(1000, () => {
      debounced.cancel();
      monitorController.clear();

      if (this.state.version === versionWhenStarted) {
        retryWithWait(50, 500, () => {
          return this.getFlexibleInnerNodeHeight();
        }).then(v => {
          this.setState({
            fixedHeight: v,
            lockForAdjustFixedHeight: false
          });
        });
      }
    });

    let heightBefore = 0;
    monitorController = runWithInterval(
      { interval: 100, maxTime: 30 },
      resolve => {
        if (this.state.version !== versionWhenStarted) {
          monitorController.clear();
          resolve();
          return;
        }

        retryWithWait(50, 500, () => {
          return this.getFlexibleInnerNodeHeight();
        }).then(current => {
          if (heightBefore !== current) {
            debounced();
            heightBefore = current;
          }
          resolve();
        });
      }
    );

    /*
    let heightBefore = 0;
    let each = 30;
    /* 
    let monitor = cnt => {
      if (monitorCancelFlag || this.state.version !== versionWhenStarted) {
        return;
      }

      retryWithWait(20, 500, () => {
        return this.getFlexibleInnerNodeHeight();
      }).then(current => {
        if (heightBefore !== current) {
          debounced();
          heightBefore = current;
        }

        /* 10 second 
        if (cnt < 10000 / each) {
          setTimeout(monitor, each, cnt + 1);
        }
      });
    };
    monitor(); */
  }

  render() {
    let checkClosedMode = false;
    let parentNest = null;

    return (
      <div
        className="info-table-root"
        onScroll={this.scrollDebounce}
        ref={this.scrollableNode}
      >
        <div
          className="wrapper-height-to-be-fixed"
          style={{
            height:
              typeof this.state.fixedHeight === "number"
                ? `${this.state.fixedHeight}px`
                : ""
          }}
        >
          <div ref={this.flexibleInnerNode}>
            <table
              className="table header-table"
              style={{ top: this.state.scrollTop }}
            >
              <tbody>
                <tr>
                  {eachWithIndex(this.props.columns, (col, idx) => {
                    return (
                      <td
                        key={"" + idx}
                        className={`header-column`}
                        style={{
                          width:
                            this.state.headerWidthList &&
                            "" + this.state.headerWidthList[idx] + "px"
                        }}
                      >
                        {col}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>

            {/*<div className="info-table-wrapper">*/}
            {/* realize sticky header row 
-- but dirty way because of IE 
* each cell's width is determined by JS after react rendering*/}

            <table
              className="table info-table"
              style={{ borderCollapse: "collapse" }}
            >
              <tbody>
                {/* area of dummy header row : needed to automatically adjusting width by browser */}
                <tr>
                  {eachWithIndex(this.props.columns, (col, idx) => {
                    return (
                      <td key={"" + idx} className={`header-column-dummy`}>
                        {col}
                      </td>
                    );
                  })}
                </tr>

                {/* main data */}
                {eachWithIndex(this.props.rows, (r, row_i) => {
                  /* prepare for each row */
                  let cell_i = -1;
                  let isClosed = false;
                  let isParentOfClosed = false;

                  if (checkClosedMode) {
                    if (
                      (r.nest || 0) > parentNest &&
                      !this.state.lockForAdjustFixedHeight
                    ) {
                      isClosed = true;
                    } else {
                      checkClosedMode = false;
                    }
                  }
                  if (this.state.closedParent[row_i]) {
                    isParentOfClosed = true;
                    checkClosedMode = true;
                    if (parentNest === null) {
                      parentNest = r.nest || 0;
                    } else {
                      parentNest = Math.min(parentNest, r.nest || 0);
                    }
                  }

                  return (
                    <tr key={row_i} style={{ display: isClosed && "none" }}>
                      {r.data.map(c => {
                        cell_i++;
                        return (
                          <td
                            key={cell_i}
                            style={{
                              paddingLeft:
                                cell_i === 0
                                  ? "" + ((r.nest || 0) * 10 + 7) + "px"
                                  : ""
                            }}
                          >
                            {(() => {
                              if (cell_i === 0) {
                                if (
                                  this.props.rows[row_i + 1] &&
                                  (this.props.rows[row_i + 1].nest || 0) >
                                    (r.nest || 0)
                                ) {
                                  return (
                                    <button
                                      style={{
                                        display: "inline",
                                        width: "20px",
                                        marginRight: "5px"
                                      }}
                                      onClick={() => {
                                        if (
                                          !this.state.lockForAdjustFixedHeight
                                        ) {
                                          this.toggleTree(row_i);
                                        }
                                      }}
                                      disabled={
                                        this.state.lockForAdjustFixedHeight
                                      }
                                    >
                                      {isParentOfClosed ? ">" : "v"}
                                    </button>
                                  );
                                } else {
                                  return (
                                    <button
                                      style={{
                                        display: "inline",
                                        width: "20px",
                                        marginRight: "5px"
                                      }}
                                      disabled={true}
                                    >
                                      -
                                    </button>
                                  );
                                }
                              }
                            })()}
                            {(() => {
                              if (this.state.editableIndex.includes(cell_i)) {
                                return (
                                  <Editable
                                    parentVersion={this.state.version}
                                    initialValue={c}
                                  />
                                );
                              } else if (
                                this.state.inputSpaceIndex.includes(cell_i)
                              ) {
                                return (
                                  <InputSpace
                                    parentVersion={this.state.version}
                                    initialValue={c}
                                  />
                                );
                              } else {
                                return c;
                              }
                            })()}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

class InputSpace extends React.Component {
  constructor(props) {
    super();
    this.state = {
      version: 0,
      importantPropsSnapshot: { parentVersion: null }
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let ret = commonGetDerivedStateFromProps(nextProps, prevState);
    if (ret === null) {
      /* null check is needed : typeof null will be 'object' */
      return null;
    } else if (typeof ret === "object") {
      return Object.assign(ret, {
        value: castForEditing(nextProps.initialValue),
        initialValue: castForEditing(nextProps.initialValue),
        changed: false
      });
    }
    return null;
  }
  render() {
    return (
      <span>
        <input
          type="text"
          value={this.state.value}
          onChange={e => {
            this.setState({
              value: e.target.value,
              changed: this.state.initialValue !== e.target.value
            });
          }}
        />
        {this.state.changed && " [Changed]"}
      </span>
    );
  }
}
class Editable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      version: 0,
      importantPropsSnapshot: { parentVersion: null }
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let ret = commonGetDerivedStateFromProps(nextProps, prevState);
    if (ret === null) {
      /* null check is needed : typeof null will be 'object' */
      return null;
    } else if (typeof ret === "object") {
      return Object.assign(ret, {
        value: castForEditing(nextProps.initialValue),
        initialValue: castForEditing(nextProps.initialValue),
        editing: false,
        changed: false
      });
    }
    return null;
  }

  render() {
    if (this.state.editing) {
      return (
        <span>
          <input
            type="text"
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
            onKeyPress={e => this.onKeyPress(e)}
          />
          <button
            style={{ display: "inline" }}
            onClick={() => {
              this.whenFinish();
            }}
          >
            ✓
          </button>
        </span>
      );
    } else {
      return (
        <span>
          {this.state.value} {this.state.changed && " [Changed]"}
          <button
            onClick={() => {
              this.startEdit();
            }}
          >
            ::
          </button>
        </span>
      );
    }
  }
  startEdit() {
    this.setState({ editing: true });
  }
  onKeyPress(e) {
    if (e.key !== "Enter") {
      return;
    }
    this.whenFinish();
  }
  whenFinish() {
    this.setState({
      editing: false,
      changed: this.state.initialValue !== this.state.value
    });
  }
}

export default TestTable;
