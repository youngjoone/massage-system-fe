
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function AddShopPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const response = await axiosInstance.post('/shops', {
        name,
        address,
        phoneNumber,
      });

      if (response.status === 200) {
        setStatus({ type: 'success', message: `가게 '${name}'이(가) 성공적으로 추가되었습니다!` });
        setName('');
        setAddress('');
        setPhoneNumber('');
        // 선택적으로 가게 목록 페이지로 리디렉션
        // navigate('/dashboard/shops'); 
      } else {
        setStatus({ type: 'danger', message: `가게 추가 실패: ${response.data.message || response.statusText}` });
      }
    } catch (error) {
      console.error('Error adding shop:', error);
      setStatus({ type: 'danger', message: `가게 추가 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}` });
    }
  };

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">새 가게 추가</h2>
          {status && <Alert variant={status.type}>{status.message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formShopName">
              <Form.Label>가게 이름</Form.Label>
              <Form.Control
                type="text"
                placeholder="가게 이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formShopAddress">
              <Form.Label>주소</Form.Label>
              <Form.Control
                type="text"
                placeholder="가게 주소를 입력하세요"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formShopPhoneNumber">
              <Form.Label>전화번호</Form.Label>
              <Form.Control
                type="text"
                placeholder="가게 전화번호를 입력하세요"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              가게 추가
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddShopPage;
