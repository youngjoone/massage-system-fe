
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        if (response.status === 200 && response.data.username) {
          setUser({ username: response.data.username }); // 사용자 정보 설정
          localStorage.setItem('user', JSON.stringify({ username: response.data.username }));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout'); // 백엔드 로그아웃 엔드포인트 호출
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
