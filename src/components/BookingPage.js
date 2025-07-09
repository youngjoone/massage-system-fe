import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function BookingPage() {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/massageservices');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedDateTime || !selectedServiceId) {
      alert('날짜, 시간 및 서비스를 모두 선택해주세요.');
      return;
    }
    
    const formattedDate = selectedDateTime.toLocaleDateString();
    const formattedTime = selectedDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const selectedService = services.find(service => service.id === parseInt(selectedServiceId));

    alert(`예약 요청:
날짜: ${formattedDate}
시간: ${formattedTime}
서비스: ${selectedService ? selectedService.name : '알 수 없음'}`);
    // Further logic for actual booking via API
  };

  if (loading) {
    return <Container className="my-4"><div>서비스 목록을 불러오는 중...</div></Container>;
  }

  if (error) {
    return <Container className="my-4"><Alert variant="danger">서비스 목록을 불러오는데 실패했습니다: {error.message}</Alert></Container>;
  }

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">예약하기</h2>
              <Form onSubmit={handleBookingSubmit}>
                <Form.Group className="mb-3" controlId="formDateTime">
                  <Form.Label>날짜 및 시간 선택</Form.Label>
                  <DatePicker
                    selected={selectedDateTime}
                    onChange={(date) => setSelectedDateTime(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    timeIntervals={30}
                    minDate={new Date()}
                    className="form-control"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formService">
                  <Form.Label>서비스 선택</Form.Label>
                  <Form.Select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    required
                  >
                    <option value="">서비스를 선택하세요</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} ({service.price}원 / {service.durationMinutes}분)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  예약하기
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default BookingPage;