import React, { Component } from "react";

import Cell from "./Cell";
import { eachWithIndex } from "../../Util";

class DataRow extends Component {
  calcType(cellIndex) {
    if (this.props.editableIndex.includes(cellIndex)) {
      return "editable";
    } else if (this.props.inputSpaceIndex.includes(cellIndex)) {
      return "inputSpace";
    }
  }

  render() {
    return (
      <tr style={{ display: this.props.isClosed && "none" }}>
        {eachWithIndex(this.props.cells, (c, i) => {
          return (
            <Cell
              key={i}
              index={i}
              type={this.calcType(i)}
              content={c}
              rowIndex={this.props.index}
              nest={this.props.nest}
              nextNest={this.props.nextNest}
              rowIsParentOfClosed={this.props.isParentOfClosed}
              pageVersion={this.props.pageVersion}
              toggleTreeFunc={this.props.toggleTreeFunc}
            />
          );
        })}
      </tr>
    );
  }
}

export default DataRow;
