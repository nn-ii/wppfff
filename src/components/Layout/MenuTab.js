import React from "react"; /* needed even when extends some coponent */
import BaseTab from "../Parts/BaseTab";
import { Link } from "react-router-dom";

class MenuTab extends BaseTab {
  createMenusTab(linkSettings) {
    return (
      <div className="menus-tab">
        {linkSettings.map((linkSetting, idx) => (
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
          { to: "/ajax_demo", text: "Ajax Demo" },
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
