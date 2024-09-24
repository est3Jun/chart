// Profile.js
import React, { useState } from 'react';
import LoginModal from './LoginModal'; // LoginModal 컴포넌트 파일 경로에 맞게 수정
import SignupModal from './SignupModal'; // SignupModal 컴포넌트 파일 경로에 맞게 수정
import './Profile.css'; // 스타일을 위한 CSS 파일 (필요 시 추가)

const Profile = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupOpen(true);
    setIsLoginOpen(false);
  };

  const closeModal = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  return (
    <div className="profile">
      <button onClick={openLoginModal}>로그인</button>
      <button onClick={openSignupModal}>회원가입</button>

      <LoginModal
        isOpen={isLoginOpen}
        onRequestClose={closeModal}
        switchToSignup={openSignupModal}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onRequestClose={closeModal}
        switchToLogin={openLoginModal}
      />
    </div>
  );
};

export default Profile;
