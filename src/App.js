
import React, { useState} from "react";

import './App.css';
import Home from "./Components/Home";
import NIHR from "./Components/NIHR";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
   

    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}>
      </Route>
      <Route path="/Home" element={<Home />}>
      </Route>
      <Route path="/NIHR" element={<NIHR />}>
      </Route>
    </Routes>
  </BrowserRouter>

 
  );
}

export default App;
