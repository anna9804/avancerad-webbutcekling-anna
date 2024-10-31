import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import './Chat.css';
import SideNav from './SideNav';


const Chat = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Tja tja, hur mår du?",
      username: loggedInUser.username,
      userId: loggedInUser.id,
    },
    {
      id: 2,
      content: "Hallå!! Svara då!!",
      username: loggedInUser.username,
      userId: loggedInUser.id,
    },
    {
      id: 3,
      content: "Sover du eller?! 😴",
      username: loggedInUser.username,
      userId: loggedInUser.id,
    },
    {
      id: 4,
      content: "Hej, allt bra med dig?",
      username: "Anna",
      userId: 2,
    },
    {
      id: 5,
      content: "Ja, det är bara bra! Hur är det själv?",
      username: "Anna",
      userId: 2,
    },
    {
      id: 6,
      content: "Vad har du för planer för helgen?",
      username: "Erik",
      userId: 3,
    },
    {
      id: 7,
      content: "Jag tänkte kanske gå på bio.",
      username: "Erik",
      userId: 3,
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("https://chatify-api.up.railway.app/messages?", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${loggedInUser.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMessages((prevMessages) => [...prevMessages, ...data]);
        } else {
          setError("Failed to fetch messages.");
        }
      } catch (err) {
        setError("An error occurred while fetching messages.");
      }
    };

    fetchMessages();
  }, [loggedInUser.token]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const sanitizedMessage = DOMPurify.sanitize(newMessage);

    const messagePayload = {
      content: sanitizedMessage,
      userId: loggedInUser.id,
      username: loggedInUser.username,
    };

    try {
      const response = await fetch("https://chatify-api.up.railway.app/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loggedInUser.token}`,
        },
        body: JSON.stringify(messagePayload),
      });

      if (response.ok) {
        const newMessageData = await response.json();
        setMessages((prevMessages) => [...prevMessages, newMessageData]);
        setNewMessage('');
      } else {
        setError("Failed to send message.");
      }
    } catch (err) {
      setError("An error occurred while sending the message.");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    try {
      const csrfToken = localStorage.getItem("csrfToken");
      const response = await fetch(`https://chatify-api.up.railway.app/messages/${msgId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${loggedInUser.token}`,
        },
      });


      if (response.ok) {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== msgId));
      } else {
        setError("Failed to delete message.");
      }
    } catch (err) {
      setError("An error occurred while deleting the message.");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.userId === loggedInUser.id ? 'message-right' : 'message-left'}`}
          >
            <div className="message-info">
              <span className="username">{message.username}</span>
            </div>
            <p className="message-content">{message.content}</p>
            {message.userId === loggedInUser.id && (
              <button className="delete-btn" onClick={() => handleDeleteMessage(message.id)}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="new-message-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Chat;
