
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function ShopManagementPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/shops/admin/shops'); // ADMIN용 엔드포인트 호출
      setShops(response.data);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch shops for admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleDeleteShop = async (shopId) => {
    if (window.confirm('정말로 이 가게를 삭제하시겠습니까? 이 가게에 연결된 사용자가 있다면 삭제할 수 없습니다.')) {
      try {
        const response = await axiosInstance.delete(`/shops/${shopId}`);
        if (response.status === 204) { // No Content
          alert('가게가 성공적으로 삭제되었습니다.');
          fetchShops(); // 목록 새로고침
        } else {
          // 이 부분은 204가 아닌 다른 성공 코드를 받을 경우를 대비하지만, 일반적으로 delete는 204를 반환
          alert(`가게 삭제 실패: ${response.data || response.statusText}`);
        }
      } catch (err) {
        console.error("Error deleting shop:", err);
        // 백엔드에서 보낸 에러 메시지를 alert로 띄웁니다.
        alert(`가게 삭제 중 오류가 발생했습니다: ${err.response?.data || err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading shops...</span>
        </Spinner>
        <p>가게 목록을 불러오는 중...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4">
        <Alert variant="danger">가게 목록을 불러오는데 실패했습니다: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">가게 관리</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button as={Link} to="/dashboard/add-shop" variant="primary">
          새 가게 추가
        </Button>
      </div>

      {shops.length === 0 ? (
        <Alert variant="info">등록된 가게가 없습니다.</Alert>
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>주소</th>
              <th>전화번호</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop) => (
              <tr key={shop.id}>
                <td>{shop.id}</td>
                <td>{shop.name}</td>
                <td>{shop.address}</td>
                <td>{shop.phoneNumber}</td>
                <td>
                  <Button as={Link} to={`/dashboard/shops/edit/${shop.id}`} variant="warning" size="sm" className="me-2">
                    수정
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteShop(shop.id)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default ShopManagementPage;
