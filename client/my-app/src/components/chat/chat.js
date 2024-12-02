import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../UserContext';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

let socket;

const Chat = () => {
  const ENDPT = 'http://localhost:5000'; // Ensure it's the full URL for the socket server

  const { user } = useContext(UserContext);
  const { room_id, room_name } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io(ENDPT);
    socket.emit('join', { name: user.name, room_id, user_id: user.id });

    // Cleanup socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [ENDPT, user.name, room_id, user.id]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up listener on unmount
    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', { message, room_id, user_id: user.id }, () => setMessage(''));
    }
  };

  return (
    <div>
      <div>{room_id} {room_name}</div>
      <h1>Chat {JSON.stringify(user)}</h1>
      <pre>{JSON.stringify(messages)}</pre>
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
