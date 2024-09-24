// LoginModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const LoginModal = ({ isOpen, onRequestClose, switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 핸들러 함수
  const handleLogin = async () => {
    try {
      // Axios GET 요청 예제
      const response = await axios.get('https://example.com/api/login', {
        params: {
          email: email,
          password: password
        }
      });
      
      // 성공 시 처리 로직
      console.log("Login Successful:", response.data);
      onRequestClose(); // 모달 닫기
    } catch (error) {
      // 오류 발생 시 처리 로직
      console.error("Login Error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      contentLabel="Login Modal"
    >
      <h2>Login</h2>
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleLogin}>Login</button>
      </form>
      <button onClick={switchToSignup}>Go to Signup</button>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default LoginModal;
