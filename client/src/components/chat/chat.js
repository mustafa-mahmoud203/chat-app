// Chat.js
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../UserContext';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Messages from './messages';

let socket;

const Chat = () => {
  const ENDPT = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000'; // Environment variable
  const { user } = useContext(UserContext);
  const { room_id, room_name } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io(ENDPT);
    socket.emit('join', { name: user.name, room_id, user_id: user.id });

    return () => {
      socket.disconnect();
    };
  }, [ENDPT, user.name, room_id, user.id]);

  useEffect(() => {
    socket.on('message', (message) => {
      try {
        console.log('Received message:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', { text: message, room_id, user_id: user.id }, () => setMessage(''));
    }
  };

  return (
    <div>
      <div>{room_id} - {room_name}</div>
      <Messages messages={messages} user_id={user.id} />
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Chat;
