import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" index Component={Home}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
