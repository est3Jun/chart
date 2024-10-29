import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRequest, postRequest, deleteRequest } from './UrlRequest';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ setSelectedPatientId, setSelectedPatientInfo }) => {
  const [userName, setUserName] = useState('');
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const application = location.state?.application || 'hearton';

  useEffect(() => {
    const fetchUserName = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const data = await getRequest(application, '/doctor', token);
        setUserName(data.nickname || '사용자');
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserName();
  }, [application]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        'http://172.30.1.125:8082/api/v1/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const fetchPatientsList = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const data = await getRequest(application, '/doctor/patients', token);
      const patientsWithBookmark = data.patients.map((patient) => ({
        ...patient,
        isBookmarked: patient.is_bookmark,
      }));
      
      // 북마크된 환자를 상단에 배치
      const sortedPatients = [
        ...patientsWithBookmark.filter((patient) => patient.isBookmarked),
        ...patientsWithBookmark.filter((patient) => !patient.isBookmarked),
      ];
      
      setPatients(sortedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('환자 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [application]);

  const searchPatients = async () => {
    if (!searchTerm) {
      setIsSearching(false);
      fetchPatientsList();
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      const token = localStorage.getItem('accessToken');
      const searchUrl = `/doctor/patients/search?name=${searchTerm}`;
      const data = await getRequest(application, searchUrl, token);
      const patientsWithBookmark = data.patients.map((patient) => ({
        ...patient,
        isBookmarked: patient.is_bookmark,
      }));
      setPatients(patientsWithBookmark);
    } catch (error) {
      console.error('Error searching patients:', error);
      setError('검색 결과를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatientId(patient.id);
    setSelectedPatientInfo(patient);
  };

  const addBookmark = async (patientId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await postRequest(application, `/doctor/${patientId}`, {}, token);
      alert('북마크로 등록되었습니다.');
      fetchPatientsList();
    } catch (error) {
      console.error('Error adding bookmark:', error);
      alert('북마크 등록에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const removeBookmark = async (patientId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await deleteRequest(application, `/doctor/${patientId}`, token);
      alert('북마크에서 삭제되었습니다.');
      fetchPatientsList();
    } catch (error) {
      console.error('Error removing bookmark:', error);
      alert('북마크에서 삭제하는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchPatientsList();
  }, [fetchPatientsList]);

  return (
    <div className="null">
      <div className="top-bar">
        <div className="top-bar-content">
          <p>{userName}님</p>
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="환자 이름 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={searchPatients} className="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      <div className="patient-list">
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul>
            {patients.map((patient) =>
              patient.name !== 'chatbot' && (
                <li key={patient.id} onClick={() => handlePatientClick(patient)}>
                  <div className="patient-info-row compact">
                    <p>
                      <strong>{patient.name}</strong> ({patient.nickname})
                    </p>
                    {patient.isBookmarked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(patient.id);
                        }}
                        className="compact-button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px', color: 'red' }}>
                          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addBookmark(patient.id);
                        }}
                        className="compact-button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', color: 'black' }}>
                          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="patient-info-row compact">
                    <p className="patient-account" style={{ fontSize: '12px', color: '#888' }}>
                      계정: {patient.account}
                    </p>
                    <p>
                      {patient.age}
                      <strong>세</strong>
                    </p>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;





  // 기기 상태 ID를 불러오는 함수. 이 코드는 주석 처리합니다.
  /*
  const fetchDeviceStatusId = useCallback(async (patientId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const data = await getRequest(application, `/doctor/${patientId}/device-status/recent`, token);
      return data.device_status_id || null;
    } catch (error) {
      console.error('기기 상태가 없습니다:', error);
      return null;
    }
  }, [application]);
  */