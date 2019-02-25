import React, { PureComponent } from "react";

class FormInput extends PureComponent {
  constructor(props) {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const toSet = {};
    toSet[this.props.parentStateKey + "Value"] = e.target.value;
    toSet[this.props.parentStateKey + "Valid"] = this.checkWhetherValid(
      e.target.value
    );

    this.props.setParentStateFunc(toSet);
  }

  checkWhetherValid(val) {
    if (this.props.validationFunc) {
      return this.props.validationFunc(val);
    } else {
      return true;
    }
  }

  render() {
    return (
      <React.Fragment>
        <input
          name={this.props.name}
          style={this.props.style}
          value={this.props.value || ""}
          onChange={this.onChange}
        />
        <div
          style={{
            display: "inline-block",
            width: "10px",
            marginLeft: "4px",
            color: "red"
          }}
        >
          {this.props.isValid || this.props.isValid === undefined ? "" : "!"}
        </div>
      </React.Fragment>
    );
  }
}

export default FormInput;
