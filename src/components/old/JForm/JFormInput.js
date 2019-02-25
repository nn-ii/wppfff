import React, { PureComponent } from "react";
import JFormContext from "./JFormContext";

class JFormInput extends PureComponent {
  constructor(props) {
    super();
    this.onChange = this.onChange.bind(this);
  }

  consumer(context) {
    return <input onChange={e => this.onChange(context, e)} />;
  }

  onChange(context, e) {
    this.runSetStateWrapper(context, e.target.value);
  }

  runSetStateWrapper(context, newValue) {
    context.setStateWrapper(this.props.elementName, newValue);
  }

  render() {
    return (
      <JFormContext.Consumer>
        {context => <input onChange={e => this.onChange(context, e)} />}
      </JFormContext.Consumer>
    );
  }
}

export default JFormInput;
