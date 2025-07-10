
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function EditShopPage() {
  const { id } = useParams(); // URL에서 shopId 가져오기
  const navigate = useNavigate();

  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/shops/${id}`);
        const shopData = response.data;
        setShopName(shopData.name);
        setAddress(shopData.address);
        setPhoneNumber(shopData.phoneNumber);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch shop details:", err);
        setStatus({ type: 'danger', message: `가게 정보를 불러오는데 실패했습니다: ${err.response?.data?.message || err.message}` });
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [id]); // id가 변경될 때마다 다시 불러오기

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const response = await axiosInstance.put(`/shops/${id}`, {
        name: shopName,
        address,
        phoneNumber,
      });

      if (response.status === 200) {
        setStatus({ type: 'success', message: `가게 '${shopName}' 정보가 성공적으로 수정되었습니다!` });
        // 수정 후 가게 관리 페이지로 돌아가기
        navigate('/dashboard/shop-management');
      } else {
        setStatus({ type: 'danger', message: `가게 정보 수정 실패: ${response.data.message || response.statusText}` });
      }
    } catch (err) {
      console.error('Error updating shop:', err);
      setStatus({ type: 'danger', message: `가게 정보 수정 중 오류가 발생했습니다: ${err.response?.data?.message || err.message}` });
    }
  };

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading shop details...</span>
        </Spinner>
        <p>가게 정보를 불러오는 중...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">오류: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">가게 정보 수정</h2>
          {status && <Alert variant={status.type}>{status.message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formShopName">
              <Form.Label>가게 이름</Form.Label>
              <Form.Control
                type="text"
                placeholder="가게 이름을 입력하세요"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
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
              수정 완료
            </Button>
            <Button variant="secondary" className="w-100 mt-2" onClick={() => navigate('/dashboard/shop-management')}>
              취소
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditShopPage;
