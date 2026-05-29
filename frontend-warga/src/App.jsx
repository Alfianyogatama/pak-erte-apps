// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AllActivities from "./pages/AllActivities";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-activities" element={<AllActivities />} />
      </Routes>
    </Router>
  );
}
export default App;
