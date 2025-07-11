import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CustomerModal = ({ show, handleClose, handleSave, customer, shops, selectedShopId }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [shopId, setShopId] = useState('');
    const [validated, setValidated] = useState(false); // 유효성 검사 상태 추가

    useEffect(() => {
        if (customer) {
            setName(customer.name);
            setPhoneNumber(customer.phoneNumber);
            setShopId(customer.shop ? customer.shop.id : '');
        } else {
            setName('');
            setPhoneNumber('');
            setShopId(selectedShopId || (shops.length > 0 ? shops[0].id : ''));
        }
        setValidated(false); // 모달 열릴 때마다 유효성 검사 상태 초기화
    }, [customer, selectedShopId, shops, show]); // show prop을 의존성 배열에 추가

    const validatePhoneNumber = (number) => {
        // 간단한 전화번호 유효성 검사 (숫자만 허용, 최소 8자리)
        return /^[0-9]{8,}$/.test(number);
    };

    const onSave = () => {
        setValidated(true); // 저장 버튼 클릭 시 유효성 검사 시작

        if (!name || !phoneNumber || !shopId || !validatePhoneNumber(phoneNumber)) {
            return; // 유효성 검사 실패 시 저장 요청 보내지 않음
        }

        handleSave({ id: customer ? customer.id : null, name, phoneNumber, shopId: Number(shopId) });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{customer ? '고객 수정' : '고객 추가'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated}>
                    <Form.Group className="mb-3">
                        <Form.Label>이름</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            isInvalid={validated && !name}
                        />
                        <Form.Control.Feedback type="invalid">
                            이름을 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>전화번호</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={phoneNumber} 
                            onChange={(e) => setPhoneNumber(e.target.value)} 
                            required 
                            isInvalid={validated && (!phoneNumber || !validatePhoneNumber(phoneNumber))}
                        />
                        <Form.Control.Feedback type="invalid">
                            유효한 전화번호를 입력해주세요 (숫자만, 최소 8자리).
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>가게</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={shopId} 
                            onChange={(e) => setShopId(e.target.value)} 
                            required
                            isInvalid={validated && !shopId}
                        >
                            {shops.map(shop => (
                                <option key={shop.id} value={shop.id}>{shop.name}</option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            가게를 선택해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>닫기</Button>
                <Button variant="primary" onClick={onSave}>저장</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomerModal;
