import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import AnnouncementModal from './AnnouncementModal';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // axiosInstance 임포트

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [announcementToDeleteId, setAnnouncementToDeleteId] = useState(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      setError(error);
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAnnouncement(null);
  };

  const handleShowModal = (announcement = null) => {
    setSelectedAnnouncement(announcement);
    setShowModal(true);
  };

  const handleSaveAnnouncement = async (announcementData) => {
    try {
      setLoading(true);
      if (announcementData.id) {
        await axiosInstance.put(`/announcements/${announcementData.id}`, announcementData);
      } else {
        await axiosInstance.post('/announcements', announcementData);
      }
      fetchAnnouncements();
      handleCloseModal();
    } catch (error) {
      setError(error);
      console.error("Failed to save announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setAnnouncementToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setAnnouncementToDeleteId(null);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/announcements/${announcementToDeleteId}`);
      fetchAnnouncements();
      handleCloseDeleteConfirm();
    } catch (error) {
      setError(error);
      console.error("Failed to delete announcement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">공지사항</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => handleShowModal()}>새 공지 추가</Button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>공지사항을 불러오는 중...</p>
        </div>
      ) : announcements.length === 0 ? (
        <Alert variant="info">등록된 공지사항이 없습니다.</Alert>
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>제목</th>
              <th>날짜</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr key={announcement.id}>
                <td>{announcement.id}</td>
                <td>{announcement.title}</td>
                <td>{new Date(announcement.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button variant="secondary" size="sm" as={Link} to={`/dashboard/announcements/${announcement.id}`} className="me-2">상세보기</Button>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(announcement)}>수정</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteClick(announcement.id)}>삭제</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <AnnouncementModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSave={handleSaveAnnouncement}
        announcement={selectedAnnouncement}
      />

      <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>공지사항 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          정말로 이 공지사항을 비활성화하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          (데이터는 삭제되지 않고, 목록에서만 보이지 않게 됩니다.)
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirm}>취소</Button>
          <Button variant="danger" onClick={confirmDelete}>확인</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AnnouncementsPage;
