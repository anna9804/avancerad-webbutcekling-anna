import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import './Chat.css';

const Chat = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
  console.log("Logged In User:", loggedInUser);

  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Tja tja, hur mår du?",
      username: "Erik",
      userId: 1,
    },
    {
      id: 2,
      content: "Hallå!! Svara då!!",
      username: "Anna",
      userId: 2,
    },
    {
      id: 3,
      content: "Sover du eller?!",
      username: "Erik",
      userId: 1,
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
      userId: 1,
    },
    {
      id: 7,
      content: "Jag tänkte kanske gå på bio.",
      username: "Erik",
      userId: 1,
    },
    // Added fake messages that will persist indefinitely
    {
      id: 8,
      content: "Fake message 1",
      username: "FakeUser1",
      userId: 3,
    },
    {
      id: 9,
      content: "Fake message 2",
      username: "FakeUser2",
      userId: 4,
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("https://chatify-api.up.railway.app/messages", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${loggedInUser.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const messagesWithUserInfo = data.map(msg => ({
              ...msg,
              userId: msg.userId || loggedInUser.id,
              username: msg.username || loggedInUser.username,
            }));
            setMessages(messagesWithUserInfo);
            console.log("Fetched messages:", messagesWithUserInfo);
          }
        } else {
          setError("Failed to fetch messages.");
        }
      } catch (err) {
        setError("An error occurred while fetching messages.");
      }
    };

    if (loggedInUser.token) {
      fetchMessages();
    }
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
        const errorDetails = await response.text();
        console.error("Send Message Error:", errorDetails);
        setError("Failed to send message. " + errorDetails);
      }
    } catch (err) {
      console.error("Error while sending message:", err);
      setError("An error occurred while sending the message.");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    const messageToDelete = messages.find(msg => msg.id === msgId);

    if (!messageToDelete) {
      console.error("Message not found in local state:", msgId);
      setError("Message not found.");
      return;
    }

    if (messageToDelete.userId !== loggedInUser.id) {
      console.error("User ID mismatch. Cannot delete this message.");
      setError("You do not have permission to delete this message.");
      return;
    }

    try {
      const response = await fetch(`https://chatify-api.up.railway.app/messages/${msgId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${loggedInUser.token}`,
        },
      });

      if (response.ok) {
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== msgId));
      } else {
        const errorDetails = await response.text();
        console.error("Delete Message Error:", errorDetails);
        setError("Failed to delete message.");
      }
    } catch (err) {
      console.error("Error while deleting message:", err);
      setError("An error occurred while deleting the message.");
    }
  };

  return (
    <div className="chat-container">
      {/* User Info Section */}
      <div className="user-info">
        <img 
          src={loggedInUser.avatar || 'https://api.multiavatar.com/seed3.svg'} 
          alt="User Avatar" 
          className="user-avatar" 
        />
        <h3>{loggedInUser.username || 'Guest'}</h3>
      </div>

      {/* Messages Section */}
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

      {/* New Message Input Section */}
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
