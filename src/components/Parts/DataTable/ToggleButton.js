import React from "react";

const ToggleButton = React.memo(props => {
  let hasChildren = (props.nextNest || 0) > (props.nest || 0);
  let isDisabled = !hasChildren || props.lockForAdjustFixedHeight;
  let onClick = isDisabled
    ? undefined
    : () => {
        props.onClick(props.rowIndex);
      };

  return (
    <button
      style={{
        display: "inline",
        width: "20px",
        marginRight: "5px"
      }}
      disabled={isDisabled}
      onClick={onClick}
    >
      {props.rowIsParentOfClosed ? ">" : "v"}
    </button>
  );
});

export default ToggleButton;
