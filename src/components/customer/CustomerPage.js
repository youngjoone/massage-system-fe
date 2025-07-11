import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';

const CustomerPage = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = () => {
        axios.get('/api/customers')
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the customers!', error);
            });
    };

    const handleSave = (customer) => {
        fetchCustomers();
        setSelectedCustomer(null);
    };

    const handleDelete = (id) => {
        axios.delete(`/api/customers/${id}`)
            .then(() => {
                fetchCustomers();
            })
            .catch(error => {
                console.error('There was an error deleting the customer!', error);
            });
    };

    return (
        <div>
            <h1>고객 관리</h1>
            <CustomerForm customer={selectedCustomer} onSave={handleSave} />
            <CustomerList customers={customers} onEdit={setSelectedCustomer} onDelete={handleDelete} />
        </div>
    );
};

export default CustomerPage;
