import React, { useState } from 'react';
import Modal from 'react-modal';
import { postRequest } from './UrlRequest'; // UrlRequest.js에서 가져오기
import './Modal.css';

const SignupModal = ({ isOpen, onRequestClose }) => {
  // 각 필드의 상태 관리
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('ko'); // 기본 언어 설정
  const [code, setCode] = useState('');
  const [application, setApplication] = useState('hearton'); // 기본값은 hearton으로 설정

  // 회원가입 핸들러 함수
  const handleSignup = async () => {
    // 비밀번호 일치 확인
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // 선택된 application에 따라 동적으로 URL을 설정
      const url = `/doctor/sign-up`;

      // postRequest 함수 사용, application을 첫 번째 인자로 전달
      const data = await postRequest(application, url, {
        account: account,
        password: password,
        name: name,
        nickname: nickname,
        phone: phone,
        language: language,
        code: code,
      });

      // 성공 시 처리 로직
      console.log('Signup Successful:', data);
      onRequestClose(); // 모달 닫기
    } catch (error) {
      // 오류 발생 시 처리 로직
      console.error('Signup Error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      contentLabel="Signup Modal"
    >
      <h2>Signup</h2>
      <form>
        {/* Application 선택 Dropdown */}
        <select
          value={application}
          onChange={(e) => setApplication(e.target.value)}
        >
          <option value="hearton">HeartOn</option>
          <option value="dialysis">Dialysis</option>
        </select>

        <input
          type="text"
          placeholder="Account"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="button" onClick={handleSignup}>Signup</button>
      </form>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default SignupModal;
