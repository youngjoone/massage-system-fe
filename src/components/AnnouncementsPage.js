import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // axiosInstance 임포트

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axiosInstance.get('/announcements'); // axiosInstance 사용
        setAnnouncements(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return <Container className="my-4"><div>공지사항을 불러오는 중...</div></Container>;
  }

  if (error) {
    return <Container className="my-4"><Alert variant="danger">공지사항을 불러오는데 실패했습니다: {error.message}</Alert></Container>;
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">공지사항</h2>
      {announcements.length === 0 ? (
        <Alert variant="info">등록된 공지사항이 없습니다.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>제목</th>
              <th>날짜</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr key={announcement.id}>
                <td>{announcement.id}</td>
                <td>{announcement.title}</td>
                <td>{new Date(announcement.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button variant="info" size="sm" as={Link} to={`/dashboard/announcements/${announcement.id}`}>상세보기</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default AnnouncementsPage;
