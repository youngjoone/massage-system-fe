import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

function HomePage() {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <Image src="https://picsum.photos/800/400" fluid rounded className="mb-4" />
          <h2>환영합니다!</h2>
          <p className="lead">
            저희 마사지 예약 사내 시스템에 오신 것을 환영합니다.
            이 시스템을 통해 편리하게 마사지 예약을 하고, 필요한 정보를 얻으며,
            동료들과 소통할 수 있습니다.
          </p>
          <p>
            최고의 휴식과 재충전을 경험하세요.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;