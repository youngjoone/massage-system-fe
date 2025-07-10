
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    // 로그인 페이지로 이동시키면서, 보여줄 메시지를 state로 전달합니다.
    return <Navigate to="/" state={{ message: "로그인해주세요" }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
