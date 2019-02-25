import React, { PureComponent } from "react";

class FormSelect extends PureComponent {
  constructor(props) {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const toSet = {};
    toSet[this.props.parentStateKey + "Value"] = e.target.value;
    this.props.setParentStateFunc(toSet);
  }
  render() {
    return (
      <select
        onChange={this.props.onChange || this.onChange}
        selected={this.props.selected}
        name={this.props.name}
      >
        {this.props.options.map((op, idx) => {
          let key = typeof op === "string" ? op : op.value;
          return (
            <option key={key} value={key}>
              {typeof op === "string" ? op : op.text}
            </option>
          );
        })}
      </select>
    );
  }
}

export default FormSelect;
