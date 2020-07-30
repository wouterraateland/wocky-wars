import "./index.scss";

import React from "react";
import ActionMessage from "./ActionMessage";
import TurnMessage from "./TurnMessage";
import PossibleActions from "./PossibleActions";

export default () => (
  <>
    <p className="hud__message w-full p-4">
      <ActionMessage />
    </p>
    <TurnMessage />
    <div className="hud__action-container flex justify-center box--wrapping--4 p-4 rounded-md glass glass-card">
      <PossibleActions />
    </div>
  </>
);
