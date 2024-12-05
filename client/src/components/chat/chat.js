// Chat.js
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../UserContext';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Messages from './messages/messages';
import Input from './input/Input';

let socket;

const Chat = () => {
  const ENDPT = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000'; // Environment variable
  const { user } = useContext(UserContext);
  const { room_id } = useParams();
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
    <div className="outerContainer">
      <div className="container">
        <Messages messages={messages} user_id={user.id} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
