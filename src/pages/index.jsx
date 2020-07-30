import React, { useContext, useState } from "react";
import { ColorModeContext } from "contexts";

import { Link } from "react-router-dom";
import * as Icons from "components/Icons";
import { IconButton } from "components/UI";

export default () => {
  const [players, setPlayers] = useState(2);
  const [subdivisions, setSubdivisions] = useState(3);
  const [colorMode, setColorMode] = useContext(ColorModeContext);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center space-y-8 text-center">
      <div>
        <h1>Wocky! wars</h1>
        <p>Turn-based strategy game</p>
      </div>
      <div className="space-y-2">
        <p>Players</p>
        <div className="flex space-x-4 items-center">
          <IconButton
            color="card"
            onClick={() => setPlayers((players) => players - 1)}
            disabled={players <= 0}
          >
            <Icons.Min />
          </IconButton>
          <p className="text-lg">{players}</p>
          <IconButton
            color="card"
            onClick={() => setPlayers((players) => players + 1)}
            disabled={players >= 5}
          >
            <Icons.Plus />
          </IconButton>
        </div>
      </div>
      <div className="space-y-2">
        <p>Map size</p>
        <div className="flex space-x-4 items-center">
          <IconButton
            color="card"
            onClick={() => setSubdivisions((subdivisions) => subdivisions - 1)}
            disabled={subdivisions <= 0}
          >
            <Icons.Min />
          </IconButton>
          <p className="text-lg">{subdivisions}</p>
          <IconButton
            color="card"
            onClick={() => setSubdivisions((subdivisions) => subdivisions + 1)}
            disabled={subdivisions >= 5}
          >
            <Icons.Plus />
          </IconButton>
        </div>
      </div>
      <Link
        className="btn btn--primary btn--md"
        to={`/g/${subdivisions}/${players}`}
      >
        Start game
      </Link>
      <IconButton
        color="card"
        onClick={() =>
          setColorMode((colorMode) => (colorMode === "dark" ? "light" : "dark"))
        }
      >
        <Icons.Eye state={colorMode === "dark" ? "closed" : "open"} />
      </IconButton>
    </div>
  );
};
