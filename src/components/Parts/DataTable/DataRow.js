import React, { Component } from "react";

import Cell from "./Cell";
import { eachWithIndex } from "../../Util";

class DataRow extends Component {
  calcType(cellIndex) {
    if (
      this.props.editableIndex &&
      this.props.editableIndex.includes(cellIndex)
    ) {
      return "editable";
    } else if (
      this.props.inputSpaceIndex &&
      this.props.inputSpaceIndex.includes(cellIndex)
    ) {
      return "inputSpace";
    }
  }

  render() {
    //console.log('DATA ROW', this.props.inputSpaceIndex)

    return (
      <tr style={{ display: this.props.isClosed && "none" }}>
        {eachWithIndex(this.props.cells, (c, i) => {
          let type = this.calcType(i);
          return (
            <Cell
              key={i}
              index={i}
              type={type}
              content={c}
              rowIndex={this.props.index}
              nest={this.props.nest}
              nextNest={this.props.nextNest}
              rowIsParentOfClosed={this.props.isParentOfClosed}
              pageVersion={this.props.pageVersion}
              toggleTreeFunc={this.props.toggleTreeFunc}
              callBackWhenEditableAction={
                type === "editable" &&
                (summary =>
                  this.props.callBackWhenEditableAction(
                    this.props.rowIndex,
                    i,
                    summary
                  ))
              }
              callBackWhenInputSpaceAction={
                type === "inputSpace" &&
                (summary =>
                  this.props.callBackWhenInputSpaceAction(
                    this.props.rowIndex,
                    i,
                    summary
                  ))
              }
            />
          );
        })}
      </tr>
    );
  }
}

export default DataRow;
