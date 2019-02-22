import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import Roster from "./Roster";
import Schedule from "./Schedule";
import Layout1x2 from "./Page/Layout1x2";
import CollateralInstructionCash from "./Page/CollateralInstructionCash";
import CollateralTransfer from "./Page/CollateralTransfer";

const Main = props => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/roster" component={Roster} />
    <Route path="/schedule" component={Schedule} />
    <Route path="/layout1x2" component={Layout1x2} />
    <Route
      path="/collateral_instruction_cash"
      component={CollateralInstructionCash}
    />
    <Route path="/collateral_transfer" component={CollateralTransfer} />
  </Switch>
);

export default Main;
