import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import BookingPage from './components/BookingPage';
import SendMessagePage from './components/SendMessagePage';
import AnnouncementsPage from './components/AnnouncementsPage';
import AddShopPage from './components/AddShopPage';
import ShopManagementPage from './components/ShopManagementPage';
import EditShopPage from './components/EditShopPage';
import AnnouncementDetailPage from './components/AnnouncementDetailPage'; // AnnouncementDetailPage 임포트
import CustomerManagementPage from './components/CustomerManagementPage';
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
                <Route path="announcements/:id" element={<AnnouncementDetailPage />} /> {/* AnnouncementDetailPage 라우트 추가 */}
                <Route path="add-shop" element={<AddShopPage />} />
                <Route path="shop-management" element={<ShopManagementPage />} />
                <Route path="shops/edit/:id" element={<EditShopPage />} />
                <Route path="customer-management" element={<CustomerManagementPage />} />
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