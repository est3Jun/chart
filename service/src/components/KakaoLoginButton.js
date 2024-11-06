import React, { useEffect } from 'react';
import KakaoButton from './kakao_login_medium_wide.png';
import axios from 'axios';

const KakaoLoginButton = () => {
  const loadKakaoSDK = () => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('kakao-sdk')) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.id = 'kakao-sdk';
      script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
      script.onload = () => {
        if (window.Kakao) {
          resolve();
        } else {
          reject(new Error("Kakao SDK 로드 실패"));
        }
      };
      script.onerror = () => reject(new Error("Kakao SDK 로드 실패"));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    // Kakao SDK 초기화
    loadKakaoSDK()
      .then(() => {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init('12f3143c767b73c6dfe04c1c8febb61c'); // 실제 JavaScript 키로 변경
        }
      })
      .catch((error) => {
        console.error(error);
      });

    // URL에서 code 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      sendCodeToBackend(code); // code가 있으면 백엔드로 전송
    }
  }, []);

  const sendCodeToBackend = async (code) => {
    try {
      const response = await axios.post('http://222.114.53.153:18504/api/v1/login/kakao', {
        application: 'hearton',
        'authorization-code': code
      });
      console.log('Login successful:', response.data);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogin = () => {
    window.Kakao.Auth.authorize({
      redirectUri: 'http://222.114.53.153:8064' // 현재 페이지 URL을 redirectUri로 설정
    });
  };

  return (
    <button onClick={handleLogin} className="kakao-login-button">
      <img src={KakaoButton} alt="카카오 로그인 버튼" style={{ width: '100%', height: '100%' }} className="kakao-login-image"/>
    </button>
  );
};

export default KakaoLoginButton;
