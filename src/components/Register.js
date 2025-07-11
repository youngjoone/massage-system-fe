import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; // axiosInstance 임포트

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [shops, setShops] = useState([]); // 가게 목록 상태
  const [selectedShopId, setSelectedShopId] = useState(''); // 선택된 가게 ID
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트 마운트 시 가게 목록을 가져옵니다.
    const fetchShops = async () => {
      try {
        const response = await axiosInstance.get('/shops');
        setShops(response.data);
      } catch (error) {
        console.error('Error fetching shops:', error);
        setErrorMessage('가게 목록을 불러오는데 실패했습니다.');
      }
    };
    fetchShops();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // 새로운 제출 시 에러 메시지 초기화

    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!selectedShopId) {
      setErrorMessage('가게를 선택해주세요.');
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/register', {
        username,
        password,
        role: 'USER', // 기본 역할은 USER
        shopId: selectedShopId, // 선택된 shopId 전송
      });

      if (response.status === 200) {
        alert('회원가입 성공!');
        navigate('/'); // Redirect to login page
      } else {
        setErrorMessage(`회원가입 실패: ${response.data.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      if (error.response && error.response.data && error.response.data.details) {
        setErrorMessage(error.response.data.details.join('\n'));
      } else {
        setErrorMessage(`회원가입 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  return (
    <div className="register-container">
      <h2>회원가입</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">사용자 이름:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="shop">가게 선택:</label>
          <select
            id="shop"
            name="shop"
            value={selectedShopId}
            onChange={(e) => setSelectedShopId(e.target.value)}
            required
          >
            <option value="">가게를 선택하세요</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">회원가입</button>
      </form>
      <p>이미 계정이 있으신가요? <Link to="/">로그인</Link></p>
    </div>
  );
}

export default Register;