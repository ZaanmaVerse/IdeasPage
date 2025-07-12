import React from "react";
import { Routes, Route } from "react-router-dom";
import IdeasPage from "./components/IdeasPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IdeasPage />} />
    </Routes>
  );
}

export default App;