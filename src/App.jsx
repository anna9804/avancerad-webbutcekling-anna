import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="./Register" element={<Register />} />
        <Route path="./Login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
