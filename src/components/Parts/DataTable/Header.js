import React, { Component } from "react";
import {
  eachWithIndex,
  eachWithIndexNotMap,
  commonGetDerivedStateFromProps,
  nTimes,
  withoutPx,
  retryWithWait
} from "../../../Util";

class Header extends Component {
  constructor(props) {
    super();
    this.state = {
      version: 0,
      importantPropsSnapshot: { columns: null, funcRefToGetStyleInfo: null },

      /* getStyleInfo func need to be followed from state
         so that static `getDerivedStateFromProps` can follow the func */
      funcToGetStyleInfo: () => this.getStyleInfo()
    };

    this.firstTrNodeRef = React.createRef();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let ret = commonGetDerivedStateFromProps(nextProps, prevState);
    if (ret === null) {
      /* null check is needed : typeof null will be 'object' */
      return null;
    } else if (typeof ret === "object") {
      if (
        nextProps.funcRefToGetStyleInfo &&
        nextProps.funcRefToGetStyleInfo !==
          prevState.importantPropsSnapshot.funcRefToGetStyleInfo
      ) {
        nextProps.funcRefToGetStyleInfo.func = prevState.funcToGetStyleInfo;
      }

      let cellMap = Header.createCellMap(nextProps.columns);
      if (nextProps.objectRefOfCellMap) {
        nextProps.objectRefOfCellMap.object = cellMap;
      }

      let lastItemList = Header.createLastItemList(nextProps.columns);
      let mapKeyToIndexOfLastItemList = {};
      eachWithIndexNotMap(lastItemList, (item, index) => {
        mapKeyToIndexOfLastItemList[
          Header.getKeyFromHeaderColumnItem(item)
        ] = index;
      });

      if (nextProps.listRefOfLastItemList) {
        nextProps.listRefOfLastItemList.list = lastItemList;
      }

      return Object.assign(ret, {
        cellMap: cellMap,
        mapKeyToIndexOfLastItemList: mapKeyToIndexOfLastItemList
      });
    }
    return null;
  }

  static mapToRowsArray(items, scanningDepth, isRoot, retArray) {
    retArray = retArray || [];
    retArray[scanningDepth] = retArray[scanningDepth] || [];

    let descendantLastItemsCount = 0;
    items.forEach(item => {
      if (typeof item === "string" || React.isValidElement(item)) {
        // this is `last item`

        retArray[scanningDepth].push({ value: item });
        descendantLastItemsCount++;
      } else if (typeof item === "object") {
        if (item.children) {
          let itemAnalysisResult = Header.mapToRowsArray(
            item.children,
            scanningDepth + 1,
            false,
            retArray
          );

          retArray[scanningDepth].push({
            id: item.id,
            value: item.value,
            descendantLastItemsCount:
              itemAnalysisResult.descendantLastItemsCount
          });

          descendantLastItemsCount =
            descendantLastItemsCount +
            itemAnalysisResult.descendantLastItemsCount;
        } else {
          retArray[scanningDepth].push({
            id: item.id,
            value: item.value
          });
          descendantLastItemsCount++;
        }
      }
    });

    if (isRoot) {
      console.log("mapToRowsArray", retArray);
      return retArray;
    } else {
      return { descendantLastItemsCount: descendantLastItemsCount };
    }
  }

  static createLastItemList(columns) {
    return Header.createLastItemListRecursive(columns, true);
  }

  static createLastItemListRecursive(items, isRoot, retArray) {
    retArray = retArray || [];

    items.forEach(item => {
      if (typeof item === "string" || React.isValidElement(item)) {
        // this is `last item`
        retArray.push({ value: item });
      } else if (typeof item === "object") {
        if (item.children) {
          Header.createLastItemListRecursive(item.children, false, retArray);
        } else {
          retArray.push({
            id: item.id,
            value: item.value
          });
        }
      }
    });

    if (isRoot) {
      return retArray;
    }
  }

  static createCellMap(columns) {
    let rowsArray = Header.mapToRowsArray(columns, 0, true);

    eachWithIndex(rowsArray, (row, rowIndex) => {
      row.forEach(col => {
        if (!col.descendantLastItemsCount) {
          col.rowSpan = rowsArray.length - rowIndex;
        }
      });
    });

    console.log("Createcellmap", rowsArray);
    return rowsArray;
  }

  static createPartCellMap(columns, isFirst) {
    //console.log("createPartCellMap", columns);

    let isPure = true;
    let list = [];
    columns.forEach(child => {
      if (typeof child === "string" || React.isValidElement(child)) {
        list.push({ value: child, depth: 0 });
      } else if (typeof child === "object") {
        isPure = false;

        let result = Header.createPartCellMap(child.children);
        //console.log("createPartCellMap result", result);
        if (Array.isArray(result)) {
          list.push({ value: child.value, depth: 1, children: result });
        } else {
          list.push({
            value: child.value,
            depth: result.depth,
            children: result.children
          });
        }
      }
    });

    if (isPure) {
      if (isFirst) {
        return { depth: 1, children: list };
      }
      return list;
    } else {
      return {
        depth:
          list.reduce(function(x, y) {
            if (x.depth > y.depth) return x.depth;
            return y.depth;
          }) + 1,
        children: list
      };
    }
  }
  static getKeyFromHeaderColumnItem(item) {
    if (typeof item.id === "string") {
      return item.id;
    } else if (typeof item.value === "string") {
      return item.value;
    }
  }

  /*
  static createPartCellMap(rootColumns, isFirst) {
    let ret = [[]];
    let currentRowIndex = -1;
    let columns = rootColumns;
    while (true) {
      currentRowIndex++;
      let toGoNext = false;
      let nextColumns = [];

      columns.forEach((child) => {
        if (typeof column === "string" || React.isValidElement(column)) {
          ret[currentRowIndex].push({value: column})
        } else if (typeof column === "object") {
          ret[currentRowIndex].push({value: column.self, colspan: column.children.length})
          
          nTimes(column.children.length - 1) {
            ret[currentRowIndex].push(null);
          }
          
          if (!ret[currentRowIndex + 1]) {
            let tmp = [];

            ret[currentRowIndex + 1] = 
          }
          toGoNext = true;
          nextColumns = nextColumns + column.children;
        }
      })

      if (!toGoNext) {
        break;
      }
    }
    




    console.log('createPartCellMap', column, isFirst)
    
    let ret = [[]];
    columns.forEach((child) => {
      if (typeof column === "string" || React.isValidElement(column)) {
        ret[0].push({value: column });
      } else if (typeof column === "object") {
        ret[0].push({value: child.self})
        ret = ret + Header.createPartCellMap(child);
      }
    })





      let ret;
      let descendantMap = column.children.map((child) => Header.createPartCellMap(child));
      ret = descendantMap;
      if (!isFirst) {
        ret = { value: column.self, rowSpan: descendantMap.length + 1 }
      }
      return descendantMap;
    }
  }
  */

  static analyze(ret, a, depth) {
    let count = 0;
    //console.log("cellmap analyze", a, depth);
    a.children.forEach(child => {
      if (child.depth === 0) {
        ret[depth].push(Object.assign(child, { rowspan: ret.length - depth }));
        count++;
      } else {
        let result = Header.analyze(ret, child, depth + 1);
        count = count + result.count;
        ret[depth].push(Object.assign(child, { colspan: result.count }));
      }
    });

    return { count: count };
  }
  /*
  static createCellMap(columns) {
    let result = Header.createPartCellMap(columns, true);

    //console.log("createPartCellMap result !!", result);

    let ret = [];
    nTimes(result.depth + 1, rowIndex => {
      ret.push([]);
    });

    Header.analyze(ret, result, 0);
    return ret;
  }
  */

  static calcCellWidth(col, colIdx, widthList) {
    if (
      (col.descendantLastItemsCount === undefined ||
        col.descendantLastItemsCount === 0) &&
      widthList &&
      widthList[colIdx]
    ) {
      return `${widthList[colIdx]}px`;
    }
    return undefined;
  }

  getStyleInfo() {
    // return Promise
    return retryWithWait(50, 500, () => this.getStyleInfoRun());
  }

  getStyleInfoRun() {
    // return width of header cells whose descendantLastItemsCount === 0

    let ret = {};
    let firstTrNode = this.firstTrNodeRef.current;
    let firstTrStyle = document.defaultView.getComputedStyle(firstTrNode);

    ret.headerWidth = withoutPx(firstTrStyle.width);

    let parentNode = firstTrNode.parentNode;
    let children = parentNode.childNodes;
    let firstTrIndex = -1;
    for (let i = 0; i < children.length; i++) {
      if (children[i] === firstTrNode) {
        firstTrIndex = i;
        break;
      }
    }
    if (firstTrIndex === -1) {
      throw "Not found row";
    }

    let widthList = [];
    eachWithIndexNotMap(this.state.cellMap, (row, rowIndex) => {
      widthList.push([]);
      eachWithIndexNotMap(row, (col, colIndex) => {
        if (
          col.descendantLastItemsCount === undefined ||
          col.descendantLastItemsCount === 0
        ) {
          widthList[rowIndex][colIndex] = withoutPx(
            document.defaultView.getComputedStyle(
              children[firstTrIndex + rowIndex].childNodes[colIndex]
            ).width
          );
        } else {
          widthList[rowIndex][colIndex] = null;
        }
      });
    });

    ret.widthList = widthList;
    return ret;
  }

  render() {
    return eachWithIndex(this.state.cellMap, (row, rowIdx) => {
      return (
        <tr key={rowIdx} ref={rowIdx === 0 && this.firstTrNodeRef}>
          {eachWithIndex(row, (col, idx) => {
            let sortButton, keyToCheck;
            if (typeof col.id === "string") {
              keyToCheck = col.id;
            } else if (typeof col.value === "string") {
              keyToCheck = col.value;
            }
            if (
              this.props.sortableIndices &&
              this.props.sortableIndices.includes(keyToCheck) &&
              this.state.mapKeyToIndexOfLastItemList &&
              this.state.mapKeyToIndexOfLastItemList[keyToCheck]
            ) {
              sortButton = (
                <button
                  onClick={() =>
                    this.props.whenSortButtonClick(
                      this.state.mapKeyToIndexOfLastItemList[keyToCheck]
                    )
                  }
                >
                  {(() => {
                    if (
                      this.props.sortColumnIndex ===
                      this.state.mapKeyToIndexOfLastItemList[keyToCheck]
                    ) {
                      if (this.props.sorted && this.props.sortReversed) {
                        return "RESET SORT";
                      } else if (this.props.sorted) {
                        return "REVERSE SORT";
                      }
                    }
                    return "SORT";
                  })()}
                </button>
              );
            }

            return (
              <td
                key={idx}
                className={this.props.tdClassName}
                style={{
                  width:
                    this.props.widthList &&
                    this.props.widthList[rowIdx] &&
                    typeof this.props.widthList[rowIdx][idx] === "number" &&
                    `${this.props.widthList[rowIdx][idx]}px`
                }}
                colSpan={col.descendantLastItemsCount}
                rowSpan={col.rowSpan}
              >
                {col.value}
                {sortButton}
              </td>
            );
          })}
        </tr>
      );
    });
    //console.log("RRRRR", rrr);
    //return rrr;
    /*
    return (
      <tr>
        {eachWithIndex(this.props.columns, (col, idx) => {
          return (
            <td
              key={idx}
              className={this.props.tdClassName}
              style={{
                width: this.props.widthList && `${this.props.widthList[idx]}px`
              }}
            >
              {col}
            </td>
          );
        })}
      </tr>
    );
    */
  }
}

export default Header;
