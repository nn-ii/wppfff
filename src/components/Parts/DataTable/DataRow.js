import React from "react";

import Cell from "./Cell";
import { eachWithIndex } from "../../Util";

const calcType = (props, cellIndex) => {
  if (props.editableIndex && props.editableIndex.includes(cellIndex)) {
    return "editable";
  } else if (
    props.inputSpaceIndex &&
    props.inputSpaceIndex.includes(cellIndex)
  ) {
    return "inputSpace";
  }
};

const DataRow = React.memo(props => (
  <tr style={{ display: props.isClosed && "none" }}>
    {eachWithIndex(props.cells, (c, i) => {
      let type = calcType(props, i);
      return (
        <Cell
          key={i}
          rowIndex={props.rowIndex}
          index={i}
          type={type}
          content={c}
          nest={props.nest}
          nextNest={props.nextNest}
          rowIsParentOfClosed={props.isParentOfClosed}
          pageVersion={props.pageVersion}
          toggleEnabled={props.toggleEnabled}
          toggleTreeFunc={props.toggleTreeFunc}
          callBackWhenEditableAction={
            type === "editable" &&
            (summary =>
              props.callBackWhenEditableAction(props.rowIndex, i, summary))
          }
          callBackWhenInputSpaceAction={
            type === "inputSpace" &&
            (summary =>
              props.callBackWhenInputSpaceAction(props.rowIndex, i, summary))
          }
        />
      );
    })}
  </tr>
));

export default DataRow;
