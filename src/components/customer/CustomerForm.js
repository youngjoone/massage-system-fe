import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerForm = ({ customer, onSave, shops, selectedShopId }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [shopId, setShopId] = useState('');

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
    }, [customer, selectedShopId, shops]);

    useEffect(() => {
        if (!customer) {
            setShopId(selectedShopId || (shops.length > 0 ? shops[0].id : ''));
        }
    }, [selectedShopId, shops, customer]);


    const handleSubmit = (event) => {
        event.preventDefault();
        const customerData = { name, phoneNumber, shopId: Number(shopId) };
        const request = customer
            ? axios.put(`/api/customers/${customer.id}`, customerData)
            : axios.post('/api/customers', customerData);

        request
            .then(response => {
                onSave(response.data);
                if (!customer) {
                    setName('');
                    setPhoneNumber('');
                }
            })
            .catch(error => {
                console.error('There was an error saving the customer!', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>이름</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>전화번호</label>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>
            <div>
                <label>가게</label>
                <select value={shopId} onChange={(e) => setShopId(e.target.value)} required>
                    {shops.map(shop => (
                        <option key={shop.id} value={shop.id}>{shop.name}</option>
                    ))}
                </select>
            </div>
            <button type="submit">저장</button>
        </form>
    );
};

export default CustomerForm;