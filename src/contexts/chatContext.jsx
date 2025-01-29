import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client"; 
// Create ChatContext
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const SOCKET_SERVER_URL = process.env.NODE_ENV === 'production' ? 'https://jibber-backend.onrender.com' : 'http://localhost:5000';
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || {});
        const newSocket = io(SOCKET_SERVER_URL, {
            transports: ["websocket", "polling"],
            auth: {
                user: userInfo
            },
        });
    
        console.log("Initializing Socket.IO client:", newSocket);
        setSocket(newSocket);
    }, []);
    
    

    return (
        <ChatContext.Provider value={{ selectedRoom, setSelectedRoom, socket }}>
            {children}
        </ChatContext.Provider>
    );
};
