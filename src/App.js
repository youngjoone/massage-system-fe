import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import BookingPage from './components/BookingPage';
import SendMessagePage from './components/SendMessagePage';
import AnnouncementsPage from './components/AnnouncementsPage';
import './App.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // 로딩 중 표시
  }

  return (
    <Router>
      <div className="App">
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<HomePage />} />
                <Route path="booking" element={<BookingPage />} />
                <Route path="send-message" element={<SendMessagePage />} />
                <Route path="announcements" element={<AnnouncementsPage />} />
              </Route>
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;