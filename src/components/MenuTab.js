import React from "react"; /* needed even when extends some coponent */
import BaseTab from "./BaseTab";
import { Link } from "react-router-dom";
import { eachWithIndex } from "./Util";

class MenuTab extends BaseTab {
  createMenusTab(linkSettings) {
    return (
      <div className="menus-tab">
        {eachWithIndex(linkSettings, (linkSetting, idx) => (
          <Link
            key={"link" + idx}
            to={linkSetting.to}
            onClick={this.props.whenMenuClick}
            className="btn blue in-menu-tab"
          >
            {linkSetting.text}
          </Link>
        ))}
      </div>
    );
  }
  render() {
    this.tabs = [
      {
        name: "IRS",
        content: this.createMenusTab([
          { to: "/", text: "Home" },
          { to: "/roster", text: "Roster" },
          { to: "/schedule", text: "Schedule" },
          { to: "/layout1x2", text: "Layout1x2" },
          {
            to: "/collateral_instruction_cash",
            text: "Collateral Instruction Cash"
          },
          { to: "/collateral_transfer", text: "Collateral Transfer" },
          {
            to: "/collateral_instruction_status",
            text: "Collateral Instruction Status"
          }
        ])
      },
      { name: "LSD", content: <div>LSD Content!</div> }
    ];

    return super.render();
  }
}

export default MenuTab;
