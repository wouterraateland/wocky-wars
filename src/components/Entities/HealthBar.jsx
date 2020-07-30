import React from "react";

export default ({ health, maxHealth }) => (
  <div className="entity__health__container">
    <div
      className="entity__health__bar h-full"
      style={{ width: `${(100 * health) / maxHealth}%` }}
    />
  </div>
);
