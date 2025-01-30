import React, { useEffect, useContext, useState, useCallback } from "react";
import { ChatContext } from "../../contexts/chatContext";
import "./ChatArea.css";
import axios from "../../utils/axiosConfig";

const ChatArea = () => {
  const { selectedRoom, socket } = useContext(ChatContext);
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([
    {
      sender: "Chayan",
      text: "Welcome to the chat!",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  // Fetch user data on component mount
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get("/api/users/profile");
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user.");
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const fetchMessages = useCallback(async () => {
    if (!selectedRoom) return;
    try {
      const response = await axios.get(`/api/chats/${selectedRoom._id}`);
      const messagesData = response.data.map((message) => ({
        sender: message.user.username,
        text: message.message,
      }));
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to fetch messages.");
    }
  }, [selectedRoom]);
  useEffect(() => {
    if (selectedRoom && socket) {
      fetchMessages();
      socket.emit("joinRoom", selectedRoom._id);
   
       socket.on("onlineUsers", (userIds)=>
      {
        const onlineSet= new Set(userIds); 
        console.log(onlineSet);
        setOnlineUsers(onlineSet);
      });
      return()=>{
        socket.off("onlineUsers");
      }
      // return () => {
      //   socket.off("onlineUsers", handleOnlineUsers);
      // };
    }
  }, [selectedRoom, socket, fetchMessages]); // Removed 'onlineUsers' from dependencies

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: message.sender, text: message.text },
        ]);
      };
      
      socket.on("newMessage", handleNewMessage);

      // Cleanup function to remove listener
      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !selectedRoom) return;
    socket.emit("sendMessage", {
      text: newMessage,
      sender: user.username,
      roomId: selectedRoom._id,
    });
    setNewMessage("");
  };
  const typing = (e) => {
    e.preventDefault();
    socket.emit("typing", {
      sender: user._id,
      roomId: selectedRoom._id,
    }

    )
    setNewMessage(e.target.value);
  }

  return (
    <div className="chat-container">
      {selectedRoom && (
        <div className="chat-area">
          <div className="room-title">{selectedRoom.name}</div>
          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.sender === user.username ? "sent" : "received"
                }`}
              >
                <strong>{message.sender}</strong>: {message.text}
              </div>
            ))}
          </div>
          <div className="message-input">
            <form onSubmit={sendMessage} style={{ display: "flex", width: "100%" }}>
              <input
                type="text"
                value={newMessage}
                onChange={typing}
                placeholder="Type a message..."
                required
              />
              <button type="submit">Send</button>
            </form>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      )}
      {!selectedRoom && <div className="no-room">Select a room to start chatting</div>}
      {selectedRoom && (
        <div className="member-list">
          <h2>Members</h2>
          <ul>
            {selectedRoom.members.map((member) => (
              <li key={member._id}>
                <span>{member.username}</span>
                {onlineUsers.has(member._id) && (
                  <span className="online-status">🟢 Online</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatArea;