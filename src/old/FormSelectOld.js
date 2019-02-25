import React from "react";
import { mapWithIndex } from "../Util";

// The FullRoster iterates over all of the players and creates
// a link to their profile page.
const FormSelect = props => {
  return (
    <select onChange={props.callbackOnChange}>
      {mapWithIndex(props.options, (op, idx) => {
        let key = typeof op === "string" ? op : op.value;
        return (
          <option key={key} value={key} selected={props.selectedItem === key}>
            {typeof op === "string" ? op : op.text}
          </option>
        );
      })}
    </select>
  );
};

export default FormSelect;
