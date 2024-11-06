// UrlRequest.js
import axios from 'axios';

// 기본 URL 설정 10.16 15:02 배포시 url로 수정이 용이하게 변경함.
const BASE_URL = {
  hearton: 'http://172.30.1.125:8001',
  dialysis: 'http://172.30.1.125:8000',
};


/* 포트로 구분 했으나, 삭제할 예정임.
const PORT_MAPPING = {
  hearton: '8001',
  dialysis: '8000',
}
*/

// 동적 URL 생성 함수, 하트온 기본설정 값
export const getBaseUrl = (application) => {
  return BASE_URL[application] || 'http://172.30.1.125:8001/';
};

// 로그인용 API 요청 (8082 포트, 배포시에는 로그인용 url로)
export const loginRequest = async (endpoint, data) => {
  try {
    const url = `http://172.30.1.125:8082${endpoint}`; // 로그인 전용 URL
    
    console.log(`Login request to URL: ${url}`); // URL 로그인 요청 확인용 (지워야함)

    const response = await axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Login request error:', error);
    throw error;
  }
};


//application 응답값에 따른 요청 함수들
// GET 요청 함수
export const getRequest = async (application, endpoint, token = null) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `${getBaseUrl(application)}${endpoint}`;
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};

// POST 요청 함수
export const postRequest = async (application, endpoint, data, token = null) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `${getBaseUrl(application)}${endpoint}`;
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

// PUT 요청 함수
export const putRequest = async (application, endpoint, data, token = null) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `${getBaseUrl(application)}${endpoint}`;
    const response = await axios.put(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('PUT request error:', error);
    throw error;
  }
};

// DELETE 요청 함수
export const deleteRequest = async (application, endpoint, token = null) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = `${getBaseUrl(application)}${endpoint}`;
    const response = await axios.delete(url, { headers });
    return response.data;
  } catch (error) {
    console.error('DELETE request error:', error);
    throw error;
  }
};

/*
// UrlRequest.js
import axios from 'axios';

// 기본 URL 설정
const BASE_URL = 'http://172.30.1.125:8001';

// GET 요청을 위한 함수
export const getRequest = async (endpoint, token) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};

// POST 요청을 위한 함수
export const postRequest = async (endpoint, data, token) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

// PUT 요청을 위한 함수
export const putRequest = async (endpoint, data, token) => {
  try {
    const response = await axios.put(`${BASE_URL}${endpoint}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('PUT request error:', error);
    throw error;
  }
};

// DELETE 요청을 위한 함수
export const deleteRequest = async (endpoint, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('DELETE request error:', error);
    throw error;
  }
};
*/
