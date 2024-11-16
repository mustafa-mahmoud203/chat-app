import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React, { useState } from 'react';
import UserContext from './UserContext.js'
import Chat from './components/chat/chat.js';
import Home from './components/home/home.js';
import Navbar from './components/layout/Navbar.js';

function App() {
  const [user, setUser] = useState(null)
  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={{ user, setUser }}>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </UserContext.Provider>
      </div>
    </Router>

  );
}

export default App;
