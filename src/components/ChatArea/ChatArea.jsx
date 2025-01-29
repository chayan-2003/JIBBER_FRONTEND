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

    const fetchUserData = async () => {
        try {
            const response = await axios.get("/api/users/profile");
            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            setError("Failed to fetch user.");
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchMessages = useCallback(async () => {
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
        if (newMessage.trim() === "") return;
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
                            <div key={index} className="message">
                                <strong>{message.sender}</strong>: {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                    {error && <div className="error">{error}</div>}
                </div>
            )}
            {!selectedRoom && <div className="no-room">Select a room to start chatting</div>}
            <div className="member-list">
                <h2>Members</h2>
                <ul>
                    {selectedRoom?.members?.map((member) => (
                        <li key={member._id}>{member.username}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChatArea;