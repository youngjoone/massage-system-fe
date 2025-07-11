import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Table, Form } from 'react-bootstrap';

function CustomerManagementPage() {
    const [customers, setCustomers] = useState([]);
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState('');

    const fetchCustomers = useCallback(() => {
        const url = selectedShop
            ? `http://localhost:8080/api/customers?shopId=${selectedShop}`
            : 'http://localhost:8080/api/customers';

        axios.get(url, { withCredentials: true })
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => console.error('Error fetching customers:', error));
    }, [selectedShop]);

    useEffect(() => {
        fetchCustomers();

        // Fetch shops (only once)
        axios.get('http://localhost:8080/api/shops', { withCredentials: true })
            .then(response => {
                setShops(response.data);
            })
            .catch(error => console.error('Error fetching shops:', error));
    }, [fetchCustomers]);

    const handleShopChange = (event) => {
        const value = event.target.value;
        setSelectedShop(value === "" ? null : Number(value));
    };

    // 필터링 로직은 이제 백엔드에서 처리하므로 프론트엔드에서는 필요 없음
    const filteredCustomers = customers;

    return (
        <div>
            <h2>고객 관리</h2>

            <Form.Group className="mb-3">
                <Form.Label>가게 선택</Form.Label>
                <Form.Select onChange={handleShopChange} value={selectedShop}>
                    <option value="">모든 가게</option>
                    {shops.map(shop => (
                        <option key={shop.id} value={shop.id}>{shop.name}</option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>소속 가게</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.phoneNumber}</td>
                            <td>{customer.shop ? customer.shop.name : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default CustomerManagementPage;
