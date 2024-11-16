import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../../UserContext'
import { Link } from 'react-router-dom'
import RoomList from './roomList'
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000'; // Your backend server URL
let socket;

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const { user, setUser } = useContext(UserContext)
  const [room, setRoom] = useState('');

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on('room-created', (roomName) => {
      console.log(`Room created: ${roomName}`);
      setRooms((prevRooms) => [...prevRooms, roomName]); // Update rooms list
    });
    return () => {
      socket.disconnect();
    }
  }, [])

  const handleSubmit = e => {
    e.preventDefault();
    if (room.trim() === '') {
      alert('Room name cannot be empty');
      return;
    }
    socket.emit('create-room', room);
    console.log(room);
    setRoom('');

  }

  const domyrooms = [
    {
      name: 'room1',
      _id: '123'
    },
    {
      name: 'room2',
      _id: '456'
    }
  ]
  const setAsMustafa = () => {
    const data = {
      id: 123,
      name: "mustafa",
      age: 24,
      email: "mustafa@gamil.com"
    }
    setUser(data)
  }
  const setAsHager = () => {
    const data = {
      id: 124,
      name: "Hager",
      age: 10,
      email: "Hager@gamil.com"
    }
    setUser(data)
  }
  return (
    <div>
      <div className="row">
        <div className="col s12 m6">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">Welcome {user ? user.name : ''}</span>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      placeholder="Enter a room name"
                      id="room" type="text" className="validate"
                      value={room}
                      onChange={e => setRoom(e.target.value)}
                    />
                    <label htmlFor="room">Room</label>
                  </div>
                </div>
                <button className="btn">Create Room</button>
              </form>
            </div>
            <div className="card-action">
              <a href="#" onClick={setAsMustafa}>set as Mustafa</a>
              <a href="#" onClick={setAsHager}>set as Hager</a>
            </div>
          </div>
        </div>
        <div className="col s6 m5 offset-1">
          <RoomList rooms={domyrooms} />
        </div>
      </div>

      <Link to={'/chat'}>
        <button>go to chat</button>
      </Link>
    </div>
  )
}

export default Home

