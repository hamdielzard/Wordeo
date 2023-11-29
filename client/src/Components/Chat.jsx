/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import '../Styles/Button.css';
import '../Styles/Chat.css';

function ChatBox({
  messages, sendMessage,
}) {
  const [inputText, setInputText] = useState('');
  const messagesContainerRef = useRef(null);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (inputText.trim() !== '') {
      // Emit the message to the server
      sendMessage(inputText);

      // Clear the input field
      setInputText('');
    }
  };

  useEffect(() => {
    // scroll to the bottom whenever messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-box">
      <div className="chat-messages" ref={messagesContainerRef}>
        {messages.map((message) => (
          <div key={message.id} className="message">
            <span className="player-name">
              {message.playerName}
              :
            </span>
            {' '}
            {message.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <button
            className="button-gray"
            type="submit"
            style={{
              marginLeft: '10px',
              fontSize: '20px',
              width: '30%',
            }}
          >
            Send

          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatBox;
