import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import IndexPage from "pages/index";
import GamePage from "pages/game";

export default () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/g/:subdivisions/:players" element={<GamePage />} />
    </Routes>
  </BrowserRouter>
);
