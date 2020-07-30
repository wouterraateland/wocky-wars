import "./Marker.scss";
import { GRID_SIZE } from "constants.json";
import cx from "classnames";

import React from "react";

export default ({ position, isActive, color = "white", ...props }) => (
  <button
    className={cx(
      "marker absolute w-8 h-8 p-0 target-position rounded-full outline-none",
      `text-${color}`,
      { "marker--active rotate": isActive }
    )}
    style={{
      top: `${position.y * GRID_SIZE}px`,
      left: `${position.x * GRID_SIZE}px`,
    }}
    {...props}
  />
);
