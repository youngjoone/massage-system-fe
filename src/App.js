import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage'; // Add this line
import BookingPage from './components/BookingPage';
import SendMessagePage from './components/SendMessagePage';
import AnnouncementsPage from './components/AnnouncementsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header is now part of Dashboard component */}
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<HomePage />} /> {/* Change this line */}
              <Route path="booking" element={<BookingPage />} />
              <Route path="send-message" element={<SendMessagePage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;