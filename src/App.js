import React from "react";
import { BrowserRouter as Router, Routes, Route,BrowserRouter } from "react-router-dom";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import AboutUs from "./components/AboutUs/AboutUs";



const App = () => {
    return (
      <BrowserRouter>
   
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<AboutUs />} />

      
                </Routes>
         
      </BrowserRouter>
    );
};

export default App;
