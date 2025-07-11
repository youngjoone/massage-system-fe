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
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard">마사지예약 사내시스템</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard/booking">예약하기</Nav.Link>
              <Nav.Link as={Link} to="/dashboard/send-message">문자보내기</Nav.Link>
              <Nav.Link as={Link} to="/dashboard/announcements">공지사항</Nav.Link>
              <Nav.Link as={Link} to="/dashboard/customer-management">고객 관리</Nav.Link>
              {user && user.role === 'ADMIN' && (
                <Nav.Link as={Link} to="/dashboard/shop-management">가게 관리</Nav.Link>
              )}
            </Nav>
            <Nav>
              {user && <Navbar.Text className="me-3">환영합니다, {user.username}님</Navbar.Text>}
              <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
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