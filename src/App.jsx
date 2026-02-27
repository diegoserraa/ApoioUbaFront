import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CadastroPonto from "./pages/CadastroPonto";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastroponto" element={<CadastroPonto />} />
      </Routes>
    </Router>
  );
}

export default App;