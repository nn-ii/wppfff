import React, { Component } from "react";

import {
  eachWithIndex,
  commonGetDerivedStateFromProps,
  nTimes
} from "../../Util";

class Header extends Component {
  constructor(props) {
    super();
    this.state = {
      version: 0,
      importantPropsSnapshot: { columns: null, funcRefToCalcEachWidth: null },

      /* calcEachWidth func need to be followed from state 
         so that static `getDerivedStateFromProps` can follow the func */
      funcToCalcEachWidth: () => this.calcEachWidth()
    };

    //console.log("createCellmap!");

    //console.log("createCellmap result", Header.createCellMap(["a", "b"]));

    /*
    console.log(
      "createCellmap result",
      Header.createCellMap2(["a", { self: "b", children: ["x", "y"] }])
    );
*/
    /*
    console.log(
      "createCellmap result",
      Header.createCellMap([
        "a",
        { self: "b", children: ["x", "y"] },
        { self: "c", children: ["x2", { self: "y2", children: ["p", "q"] }] }
      ])
    );
    */
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let ret = commonGetDerivedStateFromProps(nextProps, prevState);
    if (ret === null) {
      /* null check is needed : typeof null will be 'object' */
      return null;
    } else if (typeof ret === "object") {
      if (typeof nextProps.funcRefToCalcEachWidth === "object") {
        nextProps.funcRefToCalcEachWidth.func = prevState.funcToCalcEachWidth;
      }
      return Object.assign(ret, {
        cellMap: Header.createCellMap(nextProps.columns)
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
        let itemAnalysisResult = Header.mapToRowsArray(
          item.children,
          scanningDepth + 1,
          false,
          retArray
        );

        retArray[scanningDepth].push({
          value: item.self,
          descendantLastItemsCount: itemAnalysisResult.descendantLastItemsCount
        });

        descendantLastItemsCount =
          descendantLastItemsCount +
          itemAnalysisResult.descendantLastItemsCount;
      }
    });

    if (isRoot) {
      return retArray;
    } else {
      return { descendantLastItemsCount: descendantLastItemsCount };
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
          list.push({ value: child.self, depth: 1, children: result });
        } else {
          list.push({
            value: child.self,
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

  calcEachWidth() {
    //console.log('calcEachWidth CALLED!!', this.state)
  }

  render() {
    //console.log("HOGE", this.state.cellMap);
    return eachWithIndex(this.state.cellMap, (row, rowIdx) => {
      return (
        <tr key={rowIdx}>
          {eachWithIndex(row, (col, idx) => {
            let width = this.constructor.calcCellWidth(
              col,
              idx,
              this.props.widthList
            );
            return (
              <td
                key={idx}
                className={this.props.tdClassName}
                style={{ width: width }}
                colSpan={col.descendantLastItemsCount}
                rowSpan={col.rowSpan}
              >
                {col.value}
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
