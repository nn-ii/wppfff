import React, { Component } from "react";
import { throttle, debounce } from "throttle-debounce";
import {
  eachWithIndex,
  commonGetDerivedStateFromProps,
  withoutPx,
  cloneObjectSimple,
  retryWithWait,
  runWithInterval
} from "../Util";
import DataRow from "./DataTable/DataRow";

class DataTable extends Component {
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

    /* refs */
    this.scrollableNode = React.createRef();
    this.flexibleInnerNode = React.createRef();
    this.headerRowNode = React.createRef();
    this.dummyHeaderRowNode = React.createRef();

    this.setScrollTopStart();
    this.adjustHeaderRelatedValuesThrottle = throttle(500, () => {
      this.adjustHeaderRelatedValues();
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
        headerCellsWidthList: [],
        headerWidth: 0,
        headerHeight: 0,
        lockForAdjustFixedHeight: true,

        /* normally can use `this` insetead of self class name in static methods,
         but here can't probably because there is React restriction or so */
        editableIndex: DataTable.createEditableIndex(nextProps),
        inputSpaceIndex: DataTable.createInputSpaceIndex(nextProps)
      });
    }
    return null;
  }

  calcRowSetting(checkClosedMode, parentNest, nest, rowIndex) {
    /* prepare for each row */
    let isClosed = false;
    let isParentOfClosed = false;
    let nextCheckClosedMode = checkClosedMode;
    let nextParentNest = parentNest;

    if (checkClosedMode) {
      if ((nest || 0) > parentNest && !this.state.lockForAdjustFixedHeight) {
        isClosed = true;
      } else {
        nextCheckClosedMode = false;
      }
    }
    if (this.state.closedParent[rowIndex]) {
      isParentOfClosed = true;
      nextCheckClosedMode = true;
      if (parentNest === null) {
        nextParentNest = nest || 0;
      } else {
        nextParentNest = Math.min(parentNest, nest || 0);
      }
    }

    return {
      isClosed: isClosed,
      isParentOfClosed: isParentOfClosed,
      nextCheckClosedMode: nextCheckClosedMode,
      nextParentNest: nextParentNest
    };
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    // 1. adjusting header cells' width, and row's width and height
    this.adjustHeaderRelatedValuesThrottle();

    // 2. adjusting height (fixed) of outer of table
    // (so that height of inner of scrollable area will not be changed after user toggle tree)
    if (this.state.lockForAdjustFixedHeight) {
      this.adjustFixedHeight();
    }
  }
  setScrollTopStart() {
    this.setVariableHeightController = runWithInterval(500, resolve => {
      retryWithWait(50, 500, () => this.scrollableNode.current.scrollTop).then(
        current => {
          if (this.state.scrollTop !== current) {
            this.setState({
              scrollTop: current
            });
          }

          resolve();
        }
      );
    });
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
    console.log(row_i);
    /* if using babel-polyfill, we can use Object.assign */
    let closedParent = cloneObjectSimple(this.state.closedParent);

    if (row_i in closedParent) {
      delete closedParent[row_i];
    } else {
      closedParent[row_i] = true;
    }
    this.setState({ closedParent });
  }

  adjustHeaderRelatedValues() {
    retryWithWait(50, 500, () => [
      this.headerRowNode.current.children,
      this.dummyHeaderRowNode.current.children
    ]).then(values => {
      let willBeMerged = {};

      let cells = values[0];
      let dummyCells = values[1];
      if (dummyCells.length === 0) {
        return;
      }

      let dummyRow = dummyCells[0].parentNode;

      let anyWidthChanged = false;
      let widthIntegers = [];
      for (let i = 0; i < cells.length; i++) {
        widthIntegers[i] = this.calculateWidthToSet(dummyCells[i], cells[i]);
        if (this.state.headerCellsWidthList[i] !== widthIntegers[i]) {
          anyWidthChanged = true;
        }
      }
      if (anyWidthChanged) {
        willBeMerged.headerCellsWidthList = widthIntegers;
      }

      let dummyRowStyle = document.defaultView.getComputedStyle(dummyRow);
      let rowHeight = dummyRowStyle.height;
      if (rowHeight !== this.state.headerHeight) {
        willBeMerged.headerHeight = withoutPx(rowHeight);
      }
      let rowWidth = dummyRowStyle.width;
      if (rowWidth !== this.state.headerWidth) {
        willBeMerged.headerWidth = withoutPx(rowWidth);
      }

      /* if do not check if some changed and always do this.setState, then
      for each time componentDidUpdate() is called, and it call adjustHeaderCellsWidth ...
      => infinite loop */
      if (Object.keys(willBeMerged).length > 0) {
        this.setState(willBeMerged);
      }
    });
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
      <div className="info-table-root" ref={this.scrollableNode}>
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
            {/* header table, which has only 1 row, `header` row.
           By adjusing `top` style, user can always see this row .
           Each cell's width is determined by custom JS logic after react rendering 
           (custom JS logic changes headerCellsWidthList[i] )*/}
            <table
              className="table header-table"
              style={{ top: this.state.scrollTop }}
            >
              <tbody>
                <tr ref={this.headerRowNode}>
                  {eachWithIndex(this.props.columns, (col, idx) => {
                    return (
                      <td
                        key={"" + idx}
                        className="header-column"
                        style={{
                          width:
                            this.state.headerCellsWidthList &&
                            "" + this.state.headerCellsWidthList[idx] + "px"
                        }}
                      >
                        {/* Each cell's content should be same between real header row and dummy header row */}
                        {col}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>

            <div
              className="overlay-for-dummy-header-row"
              style={{
                top: `-${this.state.headerHeight}px`,
                width: this.state.headerWidth - 3 + "px",
                height: this.state.headerHeight - 3 + "px"
              }}
            />

            <table
              className="table info-table"
              style={{ top: `-${this.state.headerHeight * 2 - 3}px` }}
            >
              <tbody>
                {/* First row is dummy header row
                : the cells' width and row's height will be set to some state */}
                <tr ref={this.dummyHeaderRowNode}>
                  {eachWithIndex(this.props.columns, (col, idx) => {
                    return (
                      <td key={"" + idx} className="header-column-dummy">
                        {/* Each cell's content should be same between real header row and dummy header row */}
                        {col}
                      </td>
                    );
                  })}
                </tr>

                {/* main data */}
                {eachWithIndex(this.props.rows, (r, row_i) => {
                  let setting = this.calcRowSetting(
                    checkClosedMode,
                    parentNest,
                    r.nest,
                    row_i
                  );

                  // set for next loop
                  checkClosedMode = setting.nextCheckClosedMode;
                  parentNest = setting.nextParentNest;

                  return (
                    <DataRow
                      key={row_i}
                      index={row_i}
                      isClosed={setting.isClosed}
                      isParentOfClosed={setting.isParentOfClosed}
                      cells={r.data}
                      nest={r.nest}
                      nextNest={
                        this.props.rows[row_i + 1] &&
                        this.props.rows[row_i + 1].nest
                      }
                      editableIndex={this.state.editableIndex}
                      inputSpaceIndex={this.state.inputSpaceIndex}
                      pageVersion={this.state.version}
                      toggleTreeFunc={rowIndex => this.toggleTree(rowIndex)}
                    />
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

export default DataTable;
