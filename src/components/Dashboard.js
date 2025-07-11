import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div className="dashboard-layout">
      <Navbar expand="lg" className="modern-navbar shadow-sm">
        <Container fluid className="px-4">
          <Navbar.Brand as={Link} to="/dashboard" className="modern-brand">
            <span className="brand-icon">💆‍♀️</span>
            <span className="brand-text">마사지예약 사내시스템</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="modern-toggle" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto modern-nav">
              <Nav.Link as={Link} to="/dashboard/booking" className="modern-nav-link">
                <span className="nav-icon">📅</span>
                예약하기
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/send-message" className="modern-nav-link">
                <span className="nav-icon">💬</span>
                문자보내기
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/announcements" className="modern-nav-link">
                <span className="nav-icon">📢</span>
                공지사항
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard/customer-management" className="modern-nav-link">
                <span className="nav-icon">👥</span>
                고객 관리
              </Nav.Link>
              {user && user.role === 'ADMIN' && (
                <Nav.Link as={Link} to="/dashboard/shop-management" className="modern-nav-link">
                  <span className="nav-icon">🏪</span>
                  가게 관리
                </Nav.Link>
              )}
            </Nav>
            <Nav className="modern-user-section">
              {user && (
                <div className="user-welcome">
                  <span className="welcome-text">환영합니다, </span>
                  <span className="username">{user.username}님</span>
                </div>
              )}
              <Nav.Link onClick={handleLogout} className="logout-btn">
                <span className="nav-icon">🚪</span>
                로그아웃
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Outlet />
      </Container>
    </div>
  );
}

export default Dashboard;