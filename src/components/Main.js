import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import Roster from "./Roster";
import Schedule from "./Schedule";

const Main = props => (
  <Switch>
    <Route exact path="/" render={() => <Home fromRoot={props.fromRoot} />} />
    <Route path="/roster" component={Roster} />
    <Route path="/schedule" component={Schedule} />
  </Switch>
);

export default Main;
