import React, { useEffect } from 'react';
import axios from 'axios';

const KakaoCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      sendCodeToBackend(code);
    }
  }, []);

  const sendCodeToBackend = async (code) => {
    try {
      const response = await axios.post('/api/v1/login/kakao', { code });
      console.log('Login successful:', response.data);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return <div>로그인 중입니다...</div>;
};

export default KakaoCallback;
