import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // axios 임포트

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.state?.message) {
      setErrorMessage(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // axios를 사용하여 로그인 요청
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      }, {
        withCredentials: true // HttpOnly 쿠키를 받기 위해 필요
      });

      if (response.status === 200) {
        // 백엔드에서 사용자 정보를 응답 본문에 포함했다면 사용
        login(response.data); 
        alert('로그인 성공!');
        navigate('/dashboard');
      } else {
        setErrorMessage('로그인 실패. 사용자 이름 또는 비밀번호를 확인하세요.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response && error.response.status === 401) {
        setErrorMessage('로그인 실패. 사용자 이름 또는 비밀번호를 확인하세요.');
      } else {
        setErrorMessage('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
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
        <button type="submit">로그인</button>
      </form>
      <p>계정이 없으신가요? <Link to="/register">회원가입</Link></p>
    </div>
  );
}

export default Login;