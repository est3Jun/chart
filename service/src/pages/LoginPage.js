import React, { useState, useEffect, useCallback } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../components/UrlRequest'; // postRequest 함수 사용
import SignupModal from '../components/SignupModal'; 
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false); 
  const navigate = useNavigate();

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await loginRequest('/api/v1/refresh-token', { refreshToken });

      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        return response.accessToken;
      } else {
        throw new Error('Failed to refresh access token');
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      navigate('/login');
      return null;
    }
  }, [navigate]);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshAccessToken]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await loginRequest('/api/v1/login', {
        account,
        password,
        application: 'hearton', // 'hearton'만 사용
      });

      if (response.accessToken && response.refreshToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        console.log('Login Successful:', response);
  
        navigate('/dashboard', {state: {application: 'hearton'} });
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      alert(`Login failed: ${error.message || 'Please try again.'}`);
      console.error('Login Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openSignupModal = () => setIsSignupOpen(true);
  const closeSignupModal = () => setIsSignupOpen(false);

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>HeartOn</h2>
        <form>
          <input
            type="text"
            placeholder="ID"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <input
            type="password"
            placeholder="패스워드"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="additional-buttons">
          <button onClick={openSignupModal}>Go to Signup</button>
        </div>
      </div>

      <SignupModal
        isOpen={isSignupOpen}
        onRequestClose={closeSignupModal}
      />
    </div>
  );
};

export default LoginPage;
