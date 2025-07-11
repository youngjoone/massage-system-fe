import React from 'react';

const CustomerList = ({ customers, onEdit, onDelete }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>이름</th>
                    <th>전화번호</th>
                    <th>가게</th>
                    <th>작업</th>
                </tr>
            </thead>
            <tbody>
                {customers.map(customer => (
                    <tr key={customer.id}>
                        <td>{customer.name}</td>
                        <td>{customer.phoneNumber}</td>
                        <td>{customer.shop ? customer.shop.name : 'N/A'}</td>
                        <td>
                            <button onClick={() => onEdit(customer)}>수정</button>
                            <button onClick={() => onDelete(customer.id)}>삭제</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CustomerList;