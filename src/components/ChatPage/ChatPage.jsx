import React from "react";
import Sidebar from "../Sidebar/Sidebar";

import ChatArea from "../ChatArea/ChatArea"


const ChatPage = () => {
    return (
        <div className="chat-page-container">
            <Sidebar />
            <ChatArea />
        </div>
    );
};

export default ChatPage;