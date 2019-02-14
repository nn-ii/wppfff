import React from "react";
import ToggleButton from "./ToggleButton";
import Editable from "./Editable";
import InputSpace from "./InputSpace";

const Cell = props => {
  let toggleButton, paddingLeft;
  if (props.index === 0) {
    toggleButton = (
      <ToggleButton
        rowIndex={props.rowIndex}
        nest={props.nest}
        nextNest={props.nextNest}
        rowIsParentOfClosed={props.rowIsParentOfClosed}
        onClick={props.toggleTreeFunc}
      />
    );
    paddingLeft = `${(props.nest || 0) * 10 + 7}px`;
  }

  let inner;
  if (props.type === "editable") {
    inner = (
      <Editable
        parentVersion={props.pageVersion}
        initialValue={props.content}
      />
    );
  } else if (props.type === "inputSpace") {
    inner = (
      <InputSpace
        parentVersion={props.pageVersion}
        initialValue={props.content}
      />
    );
  } else {
    inner = props.content;
  }

  return (
    <td
      key={props.index}
      style={{
        paddingLeft: paddingLeft
      }}
    >
      {toggleButton}
      {inner}
    </td>
  );
};

export default Cell;
