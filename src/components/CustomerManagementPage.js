import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Form, Button, Modal, Spinner, Alert } from 'react-bootstrap';

import CustomerModal from './CustomerModal';

function CustomerManagementPage() {
    const [customers, setCustomers] = useState([]);
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

    const fetchCustomers = useCallback(() => {
        setErrorMessage(null);
        setIsLoading(true); // 로딩 시작
        const url = selectedShop
            ? `/api/customers?shopId=${selectedShop}`
            : '/api/customers';

        axios.get(url, { withCredentials: true })
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => {
                console.error('Error fetching customers:', error);
                setErrorMessage('고객 목록을 불러오는 데 실패했습니다. 서버 상태를 확인해주세요.');
            })
            .finally(() => {
                setIsLoading(false); // 로딩 종료
            });
    }, [selectedShop]);

    useEffect(() => {
        setErrorMessage(null);
        setIsLoading(true); // 로딩 시작
        axios.get('/api/shops', { withCredentials: true })
            .then(response => {
                setShops(response.data);
                if (response.data.length > 0) {
                    setSelectedShop(response.data[0].id);
                }
            })
            .catch(error => {
                console.error('Error fetching shops:', error);
                setErrorMessage('가게 목록을 불러오는 데 실패했습니다. 서버 상태를 확인해주세요.');
            })
            .finally(() => {
                setIsLoading(false); // 로딩 종료
            });
    }, []);

    useEffect(() => {
        if (selectedShop) {
            fetchCustomers();
        }
    }, [selectedShop, fetchCustomers]);

    const handleClose = () => {
        setShowModal(false);
        setSelectedCustomer(null);
    };

    const handleShow = (customer = null) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [customerToDeleteId, setCustomerToDeleteId] = useState(null);

    const handleDeleteClick = (id) => {
        setCustomerToDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleCloseDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setCustomerToDeleteId(null);
    };

    const confirmDelete = () => {
        setErrorMessage(null);
        setIsLoading(true); // 로딩 시작
        axios.delete(`/api/customers/${customerToDeleteId}`)
            .then(() => {
                fetchCustomers();
                handleCloseDeleteConfirm();
            })
            .catch(error => {
                console.error('Error deleting customer:', error);
                setErrorMessage('고객 삭제에 실패했습니다. 다시 시도해주세요.');
            })
            .finally(() => {
                setIsLoading(false); // 로딩 종료
            });
    };

    const handleSave = (customerData) => {
        setErrorMessage(null);
        setIsLoading(true); // 로딩 시작
        const request = customerData.id
            ? axios.put(`/api/customers/${customerData.id}`, customerData)
            : axios.post('/api/customers', { ...customerData, shopId: selectedShop });

        request
            .then(() => {
                fetchCustomers();
                handleClose();
            })
            .catch(error => {
                console.error('Error saving customer:', error);
                setErrorMessage('고객 정보 저장에 실패했습니다. 입력 값을 확인해주세요.');
            })
            .finally(() => {
                setIsLoading(false); // 로딩 종료
            });
    };

    const handleShopChange = (event) => {
        const value = event.target.value;
        setSelectedShop(value === "" ? null : Number(value));
    };

    return (
        <Container>
            <h2 className="my-4">고객 관리</h2>

            {errorMessage && <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>{errorMessage}</Alert>}

            <Row className="mb-3 align-items-end">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>가게 선택</Form.Label>
                        <Form.Select onChange={handleShopChange} value={selectedShop || ''}>
                            {shops.map(shop => (
                                <option key={shop.id} value={shop.id}>{shop.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={8} className="text-end">
                    <Button variant="primary" onClick={() => handleShow()}>고객 추가</Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    {isLoading ? (
                        <div className="d-flex justify-content-center my-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <Table hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>이름</th>
                                    <th>전화번호</th>
                                    <th>소속 가게</th>
                                    <th>작업</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length > 0 ? (
                                    customers.map(customer => (
                                        <tr key={customer.id}>
                                            <td>{customer.id}</td>
                                            <td>{customer.name}</td>
                                            <td>{customer.phoneNumber}</td>
                                            <td>{customer.shop ? customer.shop.name : 'N/A'}</td>
                                            <td>
                                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(customer)}>수정</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteClick(customer.id)}>삭제</Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">고객 정보가 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>

            <CustomerModal 
                show={showModal} 
                handleClose={handleClose} 
                handleSave={handleSave} 
                customer={selectedCustomer} 
                shops={shops}
                selectedShopId={selectedShop}
            />

            <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirm}>
                <Modal.Header closeButton>
                    <Modal.Title>고객 삭제 확인</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    정말로 이 고객 정보를 비활성화하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

export default CustomerManagementPage;