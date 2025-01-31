import React, { useEffect, useContext, useState, useCallback, useRef } from "react";
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
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [usersTyping, setUsersTyping] = useState(new Set());
  const typingTimeoutRef = useRef(null);



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
        timestamp: message.createdAt,
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

      socket.on("onlineUsers", (userIds) => {
        const onlineSet = new Set(userIds);
        console.log(onlineSet);
        setOnlineUsers(onlineSet);
      });
      return () => {
        socket.off("onlineUsers");
      }
      // return () => {
      //   socket.off("onlineUsers", handleOnlineUsers);
      // };
    }
  }, [selectedRoom, socket, fetchMessages]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: message.sender, text: message.text, timestamp: new Date() },
        ]);
      };

      socket.on("newMessage", handleNewMessage);

      if (selectedRoom) {
        socket.on("userTyping", (userIds) => {
          const typingSet = new Set(userIds);
          console.log("Typing users:", typingSet);
          setUsersTyping(typingSet);
        });
        socket.on("userStopTyping", (userId) => {
          const typingSet = new Set(usersTyping);
          typingSet.delete(userId);
          console.log("Typing users:", typingSet);
          setUsersTyping(typingSet);
        });
      }
      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("userTyping");
        socket.off("userStopTyping");

      };

    }
  }, [socket, selectedRoom, usersTyping]);

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

  const emitTyping = () => {
    if (socket && user && selectedRoom) {
      socket.emit("typing", { sender: user._id, roomId: selectedRoom._id });
    }
  };
  const typing = (e) => {
    setNewMessage(e.target.value);


    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    emitTyping();


    typingTimeoutRef.current = setTimeout(() => {
      if (socket && user && selectedRoom) {
        socket.emit("stopTyping", { sender: user._id, roomId: selectedRoom._id });
      }
    }, 1000);
  };


  return (
    <div className="chat-container">
      {selectedRoom && (
        <div className="chat-area">

          <div className="room-title">
            <div className="room-name-icon">
              <i class="fa-regular fa-comment"></i>
            </div>
            <div className="room-desc-components">
              <div className="selected-room-name" >{selectedRoom.name}</div>
              <div className="selected-room-description" >{selectedRoom.description}</div>
            </div>
          </div>
          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === user.username ? "sent" : "received"
                  }`}
              >
                {/* <span className="sender">{message.sender}</span> */}
                <div className="whatsapp" >
                  <div className="message-info">
                    <span className="sender">{message.sender}</span>
                    <span className="dot">•</span>
                    <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <span className="text">{message.text}</span>

                </div>
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
                className="message-input-field"
              />
              <button type="submit" className="send-button">
                <i class="fa fa-paper-plane" aria-hidden="true"></i>
              </button>
            </form>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      )}
      {!selectedRoom && <div className="no-room">JOIN AND OPEN A ROOM TO JIBBER</div> 

  }
      {selectedRoom && (
        <div className="member-list">
          <div className="member-list-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
              <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
            </svg>
            <span className="member-list-title">
              Members
            </span>
          </div>
          <ul>
            {selectedRoom.members.map((member) => {
              const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
              return (
                <ul key={member._id} className="member">
                  <div>
                    <span className="member-username" style={{ color: randomColor }}>
                      {member.username}
                    </span>
                    {onlineUsers.has(member._id) && (
                      <span className="online-status">🟢</span>
                    )}
                  </div>
                  {usersTyping.has(member._id) && (
                    <div className="typing-status">Typing...</div>
                  )}
                </ul>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatArea;