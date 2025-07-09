import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, ListGroup } from 'react-bootstrap';
import UserSelectionModal from './UserSelectionModal';

function SendMessagePage() {
  const [users, setUsers] = useState([]); // All users fetched from backend
  const [selectedRecipients, setSelectedRecipients] = useState([]); // Users selected via modal
  const [messageContent, setMessageContent] = useState('');
  const [status, setStatus] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Fetch all users once when component mounts (for modal to use)
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch all users:", error);
        // Optionally set an error state for the page if fetching all users fails
      }
    };
    fetchAllUsers();
  }, []);

  const handleSelectUsersFromModal = (selectedUsers) => {
    setSelectedRecipients(selectedUsers);
  };

  const handleRemoveRecipient = (userId) => {
    setSelectedRecipients((prevSelected) =>
      prevSelected.filter((user) => user.id !== userId)
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setStatus(null);

    if (selectedRecipients.length === 0 || !messageContent) {
      setStatus({ type: 'danger', message: '수신자와 문자 내용을 모두 입력해주세요.' });
      return;
    }

    const recipientUsernames = selectedRecipients.map((user) => user.username);

    console.log('Sending message:', {
      recipients: recipientUsernames,
      messageContent,
    });

    // Simulate API call
    setTimeout(() => {
      setStatus({ type: 'success', message: '문자가 성공적으로 전송되었습니다!' });
      setSelectedRecipients([]);
      setMessageContent('');
    }, 1500);
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">문자보내기</h2>
              {status && <Alert variant={status.type}>{status.message}</Alert>}
              <Form onSubmit={handleSendMessage}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formMessageContent">
                      <Form.Label>문자 내용</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={10}
                        placeholder="문자 내용을 입력하세요."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formRecipients">
                      <Form.Label>수신자</Form.Label>
                      <Button variant="outline-primary" onClick={() => setShowUserModal(true)} className="mb-2 w-100">
                        수신자 추가
                      </Button>
                      <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {selectedRecipients.length === 0 ? (
                          <ListGroup.Item>선택된 수신자가 없습니다.</ListGroup.Item>
                        ) : (
                          selectedRecipients.map((user) => (
                            <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                              {user.username}
                              <Button variant="danger" size="sm" onClick={() => handleRemoveRecipient(user.id)}>
                                삭제
                              </Button>
                            </ListGroup.Item>
                          ))
                        )}
                      </ListGroup>
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit" className="w-100 mt-3">
                  문자 전송
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <UserSelectionModal
        show={showUserModal}
        handleClose={() => setShowUserModal(false)}
        handleSelectUsers={handleSelectUsersFromModal}
        initialSelectedUserIds={selectedRecipients.map(user => user.id)}
      />
    </Container>
  );
}

export default SendMessagePage;