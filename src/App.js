import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./contexts/chatContext";

import Login from "./components/Login/Login";
import ChatPage from "./components/ChatPage/ChatPage";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import AboutUs from "./components/AboutUs/AboutUs";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";


const App = () => {
    return (
        <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about" element={<AboutUs />} />

                    {/* Protect the chat route */}
                    <Route 
                        path="/chat" 
                        element={
                            <PrivateRoute>
                                <ChatProvider>
                                    <ChatPage />
                                </ChatProvider>
                            </PrivateRoute>
                        } 
                    />
                </Routes>
        
        </Router>
    );
};

export default App;
