import React, { PureComponent } from "react";
import Main from "./Layout/Main";
import MenuTab from "./Layout/MenuTab";
import ToolCentering from "./Parts/ToolCentering";
import {
  retryWithWait,
  zeroPadding,
  withoutPx,
  runWithInterval,
  toggleState
} from "./Util";
import "../index.scss";

class App extends PureComponent {
  constructor() {
    super();
    this.state = {
      showingMenu: false,
      messageAreaExpanded: false,
      messages: [],
      messageThin: false,
      messageAlreadyRead: false,
      lastUpdate: "",
      toChildren: {
        mainVisibleWidth: 0,
        mainVisibleHeight: 0,
        addMessage: m => {
          this.addMessage(m);
        }
      }
    };
    this.rootNode = React.createRef();

    this.setMainVisibleSizeStart();

    this.toggleShowingMenuFunc = () => toggleState(this, "showingMenu");
    this.closeMenuFunc = () => this.setState({ showingMenu: false });

    this.setDateTimeId = setInterval(() => {
      this.setDateTime();
    }, 3000);
  }
  componentWillUnmount() {
    this.setMainVisibleSizeController.clear();
    clearInterval(this.setDateTimeId);
  }
  setDateTime() {
    let date = new Date();
    let str = `${date.getFullYear()}/${zeroPadding(
      date.getMonth(),
      2
    )}/${zeroPadding(date.getDay(), 2)} ${zeroPadding(
      date.getHours(),
      2
    )}:${zeroPadding(date.getMinutes(), 2)}:${zeroPadding(
      date.getSeconds(),
      2
    )}`;
    if (this.state.lastUpdate !== str) {
      this.setState({ lastUpdate: str });
    }
  }
  getRootStyle() {
    return document.defaultView.getComputedStyle(this.rootNode.current);
  }
  whenMenuClick() {
    this.setState({ showingMenu: false });
  }
  addMessage(message) {
    let messages = this.state.messages.slice();
    messages.push(message);
    this.setState({
      messages: messages,
      messageThin: true,
      messageAlreadyRead: false
    });

    let count = 0;
    let id = setInterval(() => {
      count++;
      this.setState({ messageThin: !this.state.messageThin });
      if (count > 2) {
        this.setState({ messageThin: false });
        clearInterval(id);
      }
    }, 500);
  }
  setMainVisibleSizeStart() {
    this.setMainVisibleSizeController = runWithInterval(500, resolve => {
      retryWithWait(50, 500, () => this.getRootStyle()).then(style => {
        let currentVisibleWidth = withoutPx(style.width) - 52;
        let currentVisibleHeight = withoutPx(style.height) - 95;
        if (
          this.state.toChildren.mainVisibleHeight !== currentVisibleHeight ||
          this.state.toChildren.mainVisibleWidth !== currentVisibleWidth
        ) {
          this.setState({
            toChildren: Object.assign(this.state.toChildren, {
              mainVisibleHeight: currentVisibleHeight,
              mainVisibleWidth: currentVisibleWidth
            })
          });
        }
        resolve();
      });
    });
  }
  render() {
    let menuWidth = "40px";
    let headerHeight = "50px";

    return (
      <div ref={this.rootNode} className="root">
        {/* header */}
        <div
          id="header"
          style={{
            width: "100%",
            height: headerHeight,
            backgroundColor: "#87cefa",
            position: "fixed",
            zIndex: "100",
            top: "0",
            left: "0"
          }}
        >
          {/* left company name */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "12px",
              height: "100%"
            }}
          >
            <ToolCentering neverChange={true}>
              <span style={{ fontSize: "120%", color: "darkblue" }}>JSCC</span>
            </ToolCentering>
          </div>

          {/* center service name */}
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%"
            }}
          >
            <ToolCentering neverChange={true}>
              <div style={{ fontSize: "120%", color: "darkblue" }}>
                Web Portal +
              </div>
            </ToolCentering>
          </div>

          {/* right service name */}
          <div style={{ position: "absolute", right: "8px", height: "100%" }}>
            <ToolCentering>
              <div style={{ fontSize: "60%", textAlign: "right" }}>
                Last Update: {this.state.lastUpdate}
                <br />
                BBBBBBBBBBBB
                <br />
                <br />
              </div>
            </ToolCentering>
          </div>
        </div>

        {/* menu */}
        <div
          id="menuRoot"
          style={{
            width: this.state.showingMenu ? "270px" : menuWidth,
            height: "100%",
            backgroundColor: "#87cefa",
            position: "fixed",
            zIndex: "100",
            top: headerHeight,
            left: "0px"
          }}
        >
          <div style={{ float: "left", width: menuWidth, height: "100%" }}>
            <ToolCentering>
              <button onClick={this.toggleShowingMenuFunc}>
                {this.state.showingMenu ? "←" : "→"}
              </button>
            </ToolCentering>
          </div>
          <div
            style={{
              float: "left",
              width: `calc(100% - ${menuWidth})`,
              height: "100%",
              backgroundColor: "skyblue",
              display: this.state.showingMenu ? "block" : "none"
            }}
          >
            <MenuTab whenMenuClick={() => this.whenMenuClick()} />
          </div>
        </div>

        {/* content */}
        <div
          className="main-content"
          onMouseEnter={this.state.showingMenu ? this.closeMenuFunc : undefined}
          onMouseMove={this.state.showingMenu ? this.closeMenuFunc : undefined}
          style={{
            top: headerHeight,
            left: `calc(${menuWidth} + 10px)`,
            width: `calc(100% - ${menuWidth} - 20px)`,
            height: `calc(100% - ${headerHeight} - 23px)`
          }}
        >
          <Main fromRoot={this.state.toChildren} />
        </div>

        {/* footer */}
        <div
          style={{
            width: "100%",
            height: "23px",
            backgroundColor: "#87cefa",
            position: "fixed",
            zIndex: "100",
            bottom: "0px",
            left: "0px"
          }}
        >
          <div
            style={{
              height: "100%",
              position: "absolute",
              left: "50px",
              fontSize: "6px"
            }}
          >
            <ToolCentering
              neverChange={true}
              content={`Copyright (C) Japan Securities Clearing Corporation. ALL RIGTHS
            RESERVED`}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
