import React, { PureComponent } from "react";
import JFormContext from "./JForm/JFormContext";

class JForm extends PureComponent {
  constructor(props) {
    super();
    this.contextProviding = {
      setStateWrapper: (elementName, value) => {
        const toSet = {};
        const key = `form${props.formName}${elementName}`;
        toSet[key] = value;
        props.parentSetStateFunc(toSet);
      }
    };
  }

  render() {
    return (
      <JFormContext.Provider value={this.contextProviding}>
        {this.props.children}
      </JFormContext.Provider>
    );
  }
}

export default JForm;
