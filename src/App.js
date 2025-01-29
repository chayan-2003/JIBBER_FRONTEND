import React from "react";
import {  Routes, Route,BrowserRouter } from "react-router-dom";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import AboutUs from "./components/AboutUs/AboutUs";
import Login from "./components/Login/Login";


const App = () => {
    return (
      <BrowserRouter>
   
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/login" element={<Login />} />
                    

      
                </Routes>
         
      </BrowserRouter>
    );
};

export default App;
