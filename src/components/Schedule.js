import React, { Component } from "react";

class Schedule extends Component {
  constructor() {
    super();
    this.state = { count: 0 };
  }
  render() {
    return (
      <div>
        {this.state.count}
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Plus
        </button>
      </div>
    );
  }
}

export default Schedule;
