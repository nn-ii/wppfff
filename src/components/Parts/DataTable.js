import React, { Component } from "react";
import { throttle, debounce } from "throttle-debounce";
import {
  eachWithIndex,
  mapWithIndex,
  eachWithIndexNotMap,
  commonGetDerivedStateFromProps,
  withoutPx,
  retryWithWait,
  runWithInterval
} from "../Util";
import DataRow from "./DataTable/DataRow";
import Header from "./DataTable/Header";

class DataTable extends Component {
  constructor() {
    super();

    /* START initial state setup */
    this.state = {
      /* for rendering */
      scrollTop: 0,

      /* for adjust fixed height */
      lockForAdjustFixedHeight: false,

      /* used in commonGetDerivedStateFromProps */
      version: 0,
      importantPropsSnapshot: {
        rows: null,
        columns: null,
        editableIndices: null,
        inputSpaceIndices: null,
        sortableIndices: null
      }
    };
    /* END initial state setup */

    /* used for adjustFixedHeight */
    this.adjustFixedHeightStartedVersion = -1;

    /* refs */
    this.scrollableNode = React.createRef();
    this.flexibleInnerNode = React.createRef();
    this.headerTableNode = React.createRef();
    this.dummyHeaderRowNode = React.createRef();

    /* func ref : Header object set its function, and later DataTable object run it */
    this.funcRefToGetStyleInfo = { func: null };

    this.objectRefOfCellMap = { object: null };

    this.setScrollTopStart();
    this.adjustHeaderRelatedValuesThrottle = throttle(500, () => {
      this.adjustHeaderRelatedValues();
    });

    this.functions = {
      toggleTree: i => this.toggleTree(i),
      toggleSortingWithKey: i => this.toggleSortingWithKey(i)
    };
    this.heavyOperation = null;

    this.debugStartDate = new Date();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let ret = commonGetDerivedStateFromProps(nextProps, prevState);
    if (ret === null) {
      /* null check is needed : typeof null will be 'object' */
      return null;
    } else if (typeof ret === "object") {
      if (nextProps.columns !== prevState.importantPropsSnapshot.columns) {
        ret.headerHeight = 0;
      }
      return Object.assign(ret, {
        closedParent: {},
        fixedHeight: null,
        headerCellsWidthList: [],
        headerWidth: 0,
        lockForAdjustFixedHeight: true,
        sorted: null,
        sortReversed: null,
        sortColumnIndex: null,
        sortColumnKey: null,

        /* below will be calculated late */
        editableIndex: null,
        inputSpaceIndex: null
      });
    }
    return null;
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate(prevProps, prevState) {
    // 1. adjusting header cells' width, and rows' width and height
    this.adjustHeaderRelatedValuesThrottle();

    // 2. adjusting height (fixed) of outer of table
    // (so that height of inner of scrollable area will not be changed after user toggle tree)
    if (this.state.lockForAdjustFixedHeight) {
      this.adjustFixedHeight();
    }

    //

    this.setIndices();

    if (prevState && this.state) {
      if (
        !prevState.heavyOperationState &&
        this.state.heavyOperationState === 1
      ) {
        this.heavyOperation();
        this.heavyOperation = null;
      } else if (
        prevState.heavyOperationState === 1 &&
        this.state.heavyOperationState === 2
      ) {
        this.setState({ heavyOperationState: null });
      }
    }
  }

  componentWillUnmount() {
    if (this.setScrollTopController) {
      this.setScrollTopController.clear();
    }
  }

  calcRowSetting(internalStateForTree, nest, rowIndex) {
    /* prepare for each row */
    let isClosed = false;
    let isParentOfClosed = false;
    let checkClosedMode = internalStateForTree.checkClosedMode;
    let parentNest = internalStateForTree.parentNest;
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

  createMapKeyToFlattenIndex() {
    let cellMap = this.objectRefOfCellMap.object;
    let ret = {};
    let flattenSerialNumber = -1;
    let cacheOfKeysSpecifiedAsId = {};
    for (let colIndex = 0; ; colIndex++) {
      let anyExists = false;
      for (let rowIndex = 0; rowIndex < cellMap.length; rowIndex++) {
        let row = cellMap[rowIndex];
        if (!row[colIndex]) {
          continue;
        }

        anyExists = true;
        if (
          !(
            typeof row[colIndex].descendantLastItemsCount !== "number" ||
            row[colIndex].descendantLastItemsCount <= 0
          )
        ) {
          continue;
        }

        flattenSerialNumber++;
        if (typeof row[colIndex].id === "string") {
          cacheOfKeysSpecifiedAsId[row[colIndex].id] = true;
          ret[row[colIndex].id] = flattenSerialNumber;
        } else if (typeof row[colIndex].value === "string") {
          if (!cacheOfKeysSpecifiedAsId[row[colIndex].value]) {
            ret[row[colIndex].value] = flattenSerialNumber;
          }
        }
      }

      if (!anyExists) {
        break;
      }
    }
    return ret;
  }
  setIndices() {
    let toCheck = [
      { stateName: "editableIndex", source: this.props.editableIndices },
      { stateName: "inputSpaceIndex", source: this.props.inputSpaceIndices }
    ].filter(
      checkItem =>
        Array.isArray(checkItem.source) &&
        this.state[checkItem.stateName] === null
    );

    if (toCheck.length === 0) {
      return;
    }

    if (!this.objectRefOfCellMap.object) {
      return;
    }

    let toSetState = {};
    let map = this.createMapKeyToFlattenIndex();
    toCheck.forEach(checkItem => {
      let ret = [];
      checkItem.source.forEach(key => {
        if (map[key] !== undefined) {
          ret.push(map[key]);
        }
      });

      toSetState[checkItem.stateName] = ret;
    });

    // Using setTimeout so that warning message from React will not emerge in browser console
    setTimeout(() => this.setState(toSetState), 1);
  }
  setScrollTopStart() {
    this.setScrollTopController = runWithInterval(500, resolve => {
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

  static createEditableIndex = props => {
    /* The index list consists of an index of column, which is in flatten base */
    let ret = [];
    if (Array.isArray(props.editableIndices)) {
      for (let i = 0; i < props.columns.length; i++) {
        if (props.editableIndices.includes(props.columns[i])) {
          ret.push(i);
        }
      }
    }
    return ret;
  };
  static createInputSpaceIndex = props => {
    let ret = [];
    if (Array.isArray(props.inputSpaceIndices)) {
      for (let i = 0; i < props.columns.length; i++) {
        if (props.inputSpaceIndices.includes(props.columns[i])) {
          ret.push(i);
        }
      }
    }
    return ret;
  };

  toggleTree(row_i) {
    let closedParent = Object.assign({}, this.state.closedParent); // state is immutable

    if (row_i in closedParent) {
      delete closedParent[row_i];
    } else {
      closedParent[row_i] = true;
    }
    this.setState({ closedParent });
  }

  adjustHeaderRelatedValues() {
    if (typeof this.funcRefToGetStyleInfo.func !== "function") {
      return;
    }

    Promise.all([
      retryWithWait(50, 500, () =>
        document.defaultView.getComputedStyle(this.headerTableNode.current)
      ),
      this.funcRefToGetStyleInfo.func()
    ]).then(list => {
      let headerTableStyle = list[0];
      let info = list[1];

      let willBeMerged = {};

      let widthList = info.widthList;

      let anyWidthChanged = false;
      eachWithIndexNotMap(widthList, (row, rowIndex) => {
        eachWithIndexNotMap(row, (col, colIndex) => {
          if (this.state.headerCellsWidthList[rowIndex]) {
            if (this.state.headerCellsWidthList[rowIndex][colIndex] !== col) {
              anyWidthChanged = true;
            }
          } else {
            anyWidthChanged = true;
          }
        });
      });
      if (anyWidthChanged) {
        willBeMerged.headerCellsWidthList = widthList;
      }

      /*
      let dummyRowStyle = document.defaultView.getComputedStyle(dummyRow);
      let rowHeight = dummyRowStyle.height; */
      let headerTableHeight = withoutPx(headerTableStyle.height);
      if (headerTableHeight !== this.state.headerHeight) {
        willBeMerged.headerHeight = headerTableHeight;
      }

      if (info.headerWidth !== this.state.headerWidth) {
        willBeMerged.headerWidth = info.headerWidth;
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
  }

  setSortedState(colIndex, toReverse) {
    let rev = 1;
    if (toReverse) {
      rev = -1;
    }

    let orderList = mapWithIndex(this.props.rows, (row, rowIndex) => ({
      rowIndex: rowIndex,
      data: row.data
    })).sort((a, b) => {
      if (a.data[colIndex] > b.data[colIndex]) {
        return 1 * rev;
      } else if (a.data[colIndex] < b.data[colIndex]) {
        return -1 * rev;
      } else if (a.rowIndex > b.rowIndex) {
        return 1;
      } else if (a.rowIndex < b.rowIndex) {
        return -1;
      } else {
        return 0;
      }
    });
    orderList = orderList.map(i => {
      return i.rowIndex;
    });

    this.debugCurrent("start heavy");
    this.heavyOperation = () => {
      this.setState({
        sorted: orderList,
        sortReversed: toReverse || false,
        sortColumnIndex: colIndex,
        heavyOperationState: 2
      });
    };
    this.setState({ heavyOperationState: 1 });
  }
  toggleSorting(colIndex) {
    if (this.state.sorted === null) {
      this.setSortedState(colIndex, false);
    } else if (this.state.sortColumnIndex === colIndex) {
      if (this.state.sortReversed === false) {
        this.setSortedState(colIndex, true);
      } else {
        this.setState({ sorted: null, sortReversed: null });
      }
    } else {
      this.setSortedState(colIndex, false);
    }
  }
  toggleSortingWithKey(key) {
    this.toggleSorting(this.createMapKeyToFlattenIndex()[key]);
    this.setState({ sortColumnKey: key });
  }
  createDataRowDefinition(r, row_i, internalStateForTree) {
    let setting = this.calcRowSetting(internalStateForTree, r.nest, row_i);

    // set for next loop
    internalStateForTree.checkClosedMode = setting.nextCheckClosedMode;
    internalStateForTree.parentNest = setting.nextParentNest;

    return (
      <DataRow
        key={row_i}
        rowIndex={row_i}
        isClosed={setting.isClosed}
        isParentOfClosed={setting.isParentOfClosed}
        cells={r.data}
        nest={r.nest}
        nextNest={this.props.rows[row_i + 1] && this.props.rows[row_i + 1].nest}
        editableIndex={this.state.editableIndex}
        inputSpaceIndex={this.state.inputSpaceIndex}
        pageVersion={this.state.version}
        toggleTreeFunc={this.functions.toggleTree}
        callBackWhenEditableAction={this.props.callBackWhenEditableAction}
        callBackWhenInputSpaceAction={this.props.callBackWhenInputSpaceAction}
      />
    );
  }

  render() {
    let internalStateForTree = {
      checkClosedMode: false,
      parentNest: null
    };
    let checkClosedMode = false;
    let parentNest = null;

    return (
      <div
        className="info-table-root"
        ref={this.scrollableNode}
        style={{
          position: "relative",
          zIndex:
            this.props.zIndex ||
            1 /* intentionally specify zIndex so that a new `stack context` will be created */
        }}
      >
        <div
          className="wrapper-height-to-be-fixed"
          style={{
            height:
              typeof this.state.fixedHeight === "number" &&
              `${this.state.fixedHeight}px`
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
              ref={this.headerTableNode}
            >
              <tbody>
                <Header
                  columns={this.props.columns}
                  widthList={this.state.headerCellsWidthList}
                  objectRefOfCellMap={this.objectRefOfCellMap}
                  sortableIndices={this.props.sortableIndices}
                  sorted={this.state.sorted}
                  sortReversed={this.state.sortReversed}
                  sortColumnKey={this.state.sortColumnKey}
                  whenSortButtonClick={this.functions.toggleSortingWithKey}
                />
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
                <Header
                  columns={this.props.columns}
                  funcRefToGetStyleInfo={this.funcRefToGetStyleInfo}
                  sortableIndices={this.props.sortableIndices}
                  sorted={this.state.sorted}
                  sortReversed={this.state.sortReversed}
                  sortColumnKey={this.state.sortColumnKey}
                />

                {/* main data rows */}
                {this.state.sorted
                  ? this.state.sorted.map(i =>
                      this.createDataRowDefinition(
                        this.props.rows[i],
                        i,
                        internalStateForTree
                      )
                    )
                  : eachWithIndex(this.props.rows, (row, rowIndex) =>
                      this.createDataRowDefinition(
                        row,
                        rowIndex,
                        internalStateForTree
                      )
                    )}
              </tbody>
            </table>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            size: "40px",
            top: "40px",
            zIndex: "30",
            display: this.state.heavyOperationState || "none"
          }}
        >
          In progress ....
        </div>
      </div>
    );
  }

  /* for-debug area */

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
}

export default DataTable;
