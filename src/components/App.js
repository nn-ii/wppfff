import React, { Component } from "react";
import Main from "./Main";
import MenuTab from "./MenuTab";
import ToolTableCell from "./ToolTableCell";
import "../index.scss";
import { retryWithWait, zeroPadding, withoutPx, runWithInterval } from "./Util";
import { throttle } from "throttle-debounce";

class App extends Component {
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

    this.setDateTimeId = setInterval(() => {
      this.setDateTime();
    }, 100);
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
    let messageAreaNormalHeight = "30px";
    let messageAreaExpandedHeight = "100px";
    let messageAreaHeight = this.state.messageAreaExpanded
      ? messageAreaExpandedHeight
      : messageAreaNormalHeight;

    return (
      <div ref={this.rootNode} className="root">
        {/* header */}
        <div
          id="header"
          style={{
            width: "100%",
            height: headerHeight,
            backgroundColor: "deepskyblue",
            position: "fixed",
            zIndex: "100",
            top: "0px",
            left: "0px"
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
            <ToolTableCell
              content={
                <div style={{ fontSize: "120%", color: "darkblue" }}>JSCC</div>
              }
            />
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
            <ToolTableCell
              content={
                <div style={{ fontSize: "120%", color: "darkblue" }}>
                  Web Portal +
                </div>
              }
            />
          </div>

          {/* right service name */}
          <div style={{ float: "right", height: "100%", marginRight: "8px" }}>
            <ToolTableCell
              content={
                <div style={{ fontSize: "60%", textAlign: "right" }}>
                  Last Update: {this.state.lastUpdate}
                  <br />
                  BBBBBBBBBBBB
                  <br />
                  <br />
                </div>
              }
            />
          </div>
        </div>

        {/* menu */}
        <div
          id="menuRoot"
          style={{
            width: this.state.showingMenu ? "270px" : menuWidth,
            height: "100%",
            backgroundColor: "deepskyblue",
            position: "fixed",
            zIndex: "100",
            top: headerHeight,
            left: "0px"
          }}
        >
          <div style={{ float: "left", width: menuWidth, height: "100%" }}>
            <ToolTableCell
              content={
                <button
                  onClick={() =>
                    this.setState({ showingMenu: !this.state.showingMenu })
                  }
                >
                  {this.state.showingMenu ? "←" : "→"}
                </button>
              }
            />
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
          onMouseEnter={() => {
            this.setState({ showingMenu: false });
          }}
          onMouseMove={() => {
            this.setState({ showingMenu: false });
          }}
          style={{
            top: headerHeight,
            left: menuWidth,
            width: `calc(100% - ${menuWidth})`,
            height: `calc(100% - ${headerHeight} - ${messageAreaHeight} - 10px)`
          }}
        >
          <Main fromRoot={this.state.toChildren} />
        </div>

        {/* message to user */}
        <div
          onClick={() => {
            let messageAlreadyRead = this.state.messageAlreadyRead;
            if (this.state.messageAreaExpanded) {
              messageAlreadyRead = true;
            }
            this.setState({
              messageAreaExpanded: !this.state.messageAreaExpanded,
              messageAlreadyRead: messageAlreadyRead
            });
          }}
          className={"messages " + (this.state.messageThin && "thin")}
          style={{
            position: "absolute",
            bottom: 0,
            left: menuWidth,
            width: `calc(100% - ${menuWidth})`,
            height: messageAreaHeight,
            color: "white",

            /* deliberately overwrite CSS style */
            backgroundColor:
              this.state.messages.length === 0 || this.state.messageAlreadyRead
                ? "#e48181"
                : ""
          }}
        >
          {this.state.messageAreaExpanded ? (
            <div>
              {this.state.messages.map(m => {
                return <div>{m}</div>;
              })}
            </div>
          ) : (
            <div>{this.state.messages.length} messages</div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
