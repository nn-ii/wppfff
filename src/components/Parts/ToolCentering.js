import React from "react";

const ToolCentering = React.memo(
  props => (
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
  ),

  // if `neverChange` prop is true, never re-calculated
  (prevProp, nextProp) => !!nextProp.neverChange
);

export default ToolCentering;
