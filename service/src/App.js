import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // 로그인 페이지 컴포넌트
import DashboardPage from './pages/DashboardPage'; // 대시보드 페이지 컴포넌트
import DialysisPage from './pages/DialysisPage' ;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dialysis" element={<DialysisPage />} />
        <Route path="*" element={<LoginPage />} /> {/* 기본 경로를 로그인 페이지로 설정 */}
      </Routes>
    </Router>
  );
};

export default App;
