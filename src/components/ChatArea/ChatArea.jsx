import React, { useEffect, useContext, useState, useCallback } from "react";
import { ChatContext } from "../../contexts/chatContext";
import "./ChatArea.css";
import axios from  'axios';

// Define APIURL outside the component to ensure it's a constant
const APIURL =
  process.env.NODE_ENV === "production"
    ? "https://jibber-backend.onrender.com"
    : "http://localhost:5000";

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

  // Fetch user data on component mount
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(`${APIURL}/api/users/profile`,{ withCredentials: true });
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

  // Fetch messages for the selected room
  const fetchMessages = useCallback(async () => {
    if (!selectedRoom) return;
    try {
      const response = await axios.get(`${APIURL}/api/chats/${selectedRoom._id}`,{ withCredentials: true });
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
    }
  }, [selectedRoom, socket, fetchMessages]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: message.sender, text: message.text },
        ]);
      };
      socket.on("newMessage", handleNewMessage);
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

  return (
    <div className="chat-container">
      {selectedRoom && (
        <div className="chat-area">
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender === user.username ? "sent" : "received"}`}>
                <strong>{message.sender}</strong>: {message.text}
              </div>
            ))}
          </div>
          <div className="message-input">
            <form onSubmit={sendMessage} style={{ display: "flex", width: "100%" }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
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
              <li key={member._id}>{member.username}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatArea;