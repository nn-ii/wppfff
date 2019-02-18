import React from "react";
import PlayerAPI from "../api";
import { Link } from "react-router-dom";
import ToolOnOffSwitch from "./ToolOnOffSwitch";
import Modal from "./Parts/Modal";

// The FullRoster iterates over all of the players and creates
// a link to their profile page.
const FullRoster = () => (
  <div>
    <ul>
      {PlayerAPI.all().map(p => (
        <li key={p.number}>
          <Link to={`/roster/${p.number}`}>{p.name}</Link>
        </li>
      ))}
    </ul>
    <ToolOnOffSwitch on={true} />
    <Modal title="confirm" content="OK?" />
  </div>
);

export default FullRoster;
