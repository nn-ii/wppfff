import React from "react";

const ToolTableCell = props => (
  <div
    className="table_wrapper"
    style={{ display: "table", width: "100%", height: "100%" }}
  >
    <div
      className="table_wrapper_cell"
      style={{
        display: "table-cell",
        width: "100%",
        verticalAlign: "middle",
        textAlign: props.textAlign ? props.textAlign : "center",
        height: "100%"
      }}
    >
      {props.children || props.content}
    </div>
  </div>
);

export default ToolTableCell;
