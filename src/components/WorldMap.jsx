import { GRID_SIZE } from "constants.json";
import React, { useLayoutEffect, useRef } from "react";
import useGameContext from "hooks/useGameContext";

const rgb = "64, 64, 64";
const POINT_SIZE = GRID_SIZE * 2;

const drawMap = (canvas, positions, width, height) => {
  const ctx = canvas.getContext("2d");
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  const threshold = 210;

  canvas.width = tempCanvas.width = width;
  canvas.height = tempCanvas.height = height;

  positions.forEach(({ x, y }) => {
    tempCtx.beginPath();
    var grad = tempCtx.createRadialGradient(x, y, 1, x, y, POINT_SIZE);
    grad.addColorStop(0, `rgba(${rgb}, 1)`);
    grad.addColorStop(1, `rgba(${rgb}, 0)`);
    tempCtx.fillStyle = grad;
    tempCtx.arc(x, y, POINT_SIZE, 0, Math.PI * 2);
    tempCtx.fill();
  });

  var imageData = tempCtx.getImageData(0, 0, width, height),
    pix = imageData.data;

  for (var i = 0, n = pix.length; i < n; i += 4) {
    if (pix[i + 3] < threshold) {
      pix[i + 3] /= 6;
      if (pix[i + 3] > threshold / 4) {
        pix[i + 3] = 0;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);

  positions.forEach(({ x, y }) => {
    ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  });
};

export default ({ children }) => {
  const canvasRef = useRef(null);
  const game = useGameContext();
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const world = game.world;

    if (canvas) {
      drawMap(
        canvas,
        world
          .values()
          .filter(({ height }) => height > 0)
          .map(({ x, y }) => ({
            x: (x + 1 / 2) * GRID_SIZE + POINT_SIZE / 2,
            y: (y + 1 / 2) * GRID_SIZE + POINT_SIZE / 2,
          })),
        (world.getWidth() + 2) * GRID_SIZE,
        (world.getHeight() + 2) * GRID_SIZE
      );
    }
  }, [game.world]);

  return (
    <div className="relative game__canvas-container">
      <canvas ref={canvasRef} className="game__canvas m--8" />
      {children}
    </div>
  );
};
