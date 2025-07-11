
import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function AnnouncementDetailPage() {
  const { id } = useParams(); // URL에서 공지사항 ID 가져오기
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/announcements/${id}`);
        setAnnouncement(response.data);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch announcement details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncementDetails();
  }, [id]); // id가 변경될 때마다 다시 불러오기

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading announcement...</span>
        </Spinner>
        <p>공지사항을 불러오는 중...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">공지사항을 불러오는데 실패했습니다: {error.message}</Alert>
      </Container>
    );
  }

  if (!announcement) {
    return (
      <Container className="my-4">
        <Alert variant="info">공지사항을 찾을 수 없습니다.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title as="h2" className="mb-3">{announcement.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            작성일: {new Date(announcement.createdAt).toLocaleDateString()}
          </Card.Subtitle>
          <Card.Text style={{ whiteSpace: 'pre-wrap' }}>
            {announcement.content}
          </Card.Text>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            목록으로 돌아가기
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AnnouncementDetailPage;
