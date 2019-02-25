import React from "react";
import { Switch, Route } from "react-router-dom";
import AjaxDemo from "../Page/AjaxDemo";
import CollateralInstructionCash from "../Page/CollateralInstructionCash";
import CollateralTransfer from "../Page/CollateralTransfer";
import CollateralInstructionStatus from "../Page/CollateralInstructionStatus";

const Main = props => (
  <Switch>
    <Route exact path="/" component={CollateralInstructionCash} />
    <Route path="/ajax_demo" component={AjaxDemo} />
    <Route
      path="/collateral_instruction_cash"
      component={CollateralInstructionCash}
    />
    <Route path="/collateral_transfer" component={CollateralTransfer} />
    <Route
      path="/collateral_instruction_status"
      component={CollateralInstructionStatus}
    />
  </Switch>
);

export default Main;
