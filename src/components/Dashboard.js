import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';

function Dashboard() {
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
            </Nav>
            <Nav>
              {/* User info or logout button can go here */}
              <Nav.Link href="#logout">로그아웃</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Outlet /> {/* This is where nested routes will render */}
      </Container>
    </div>
  );
}

export default Dashboard;