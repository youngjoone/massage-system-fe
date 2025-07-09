import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup, Alert } from 'react-bootstrap';

function UserSelectionModal({ show, handleClose, handleSelectUsers, initialSelectedUserIds = [] }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSelectedUserIds, setCurrentSelectedUserIds] = useState(initialSelectedUserIds);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (show) { // Fetch users only when modal is shown
      fetchUsers();
      setCurrentSelectedUserIds(initialSelectedUserIds); // Reset selected users when modal opens
    }
  }, [show, initialSelectedUserIds]);

  const handleCheckboxChange = (userId) => {
    setCurrentSelectedUserIds((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSelected = () => {
    const selectedUsers = users.filter(user => currentSelectedUserIds.includes(user.id));
    handleSelectUsers(selectedUsers);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>수신자 선택</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="사용자 이름 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>

        {loading ? (
          <div>사용자 목록을 불러오는 중...</div>
        ) : error ? (
          <Alert variant="danger">사용자 목록을 불러오는데 실패했습니다: {error.message}</Alert>
        ) : filteredUsers.length === 0 ? (
          <Alert variant="info">검색 결과가 없습니다.</Alert>
        ) : (
          <ListGroup style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {filteredUsers.map((user) => (
              <ListGroup.Item key={user.id}>
                <Form.Check
                  type="checkbox"
                  id={`modal-user-${user.id}`}
                  label={user.username}
                  checked={currentSelectedUserIds.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleAddSelected}>
          선택 완료
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserSelectionModal;
