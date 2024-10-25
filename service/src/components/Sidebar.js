import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRequest, postRequest, deleteRequest } from './UrlRequest';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ setSelectedPatientId, setSelectedDeviceStatusId, setSelectedPatientInfo }) => {
  const [userName, setUserName] = useState('');
  const [patients, setPatients] = useState([]);
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAssignedOnly, setSearchAssignedOnly] = useState(true);
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



  const fetchAssignedPatients = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const data = await getRequest(application, '/doctor/patients', token);
      const assignedPatientIds = data.patients.map((patient) => patient.id);
      setAssignedPatients(assignedPatientIds);
      localStorage.setItem('assignedPatients', JSON.stringify(assignedPatientIds));
    } catch (error) {
      console.error('Error fetching assigned patients:', error);
      setError('담당 환자 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [application]);

  const searchPatients = async () => {
    if (!searchTerm) {
      setIsSearching(false);
      fetchAssignedPatientsWithDeviceStatus();
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      const token = localStorage.getItem('accessToken');
      const searchUrl = searchAssignedOnly
        ? `/doctor/patients/search?name=${searchTerm}`
        : `/patients/search?name=${searchTerm}`;
      const data = await getRequest(application, searchUrl, token);
      setPatients(data.patients);
    } catch (error) {
      console.error('Error searching patients:', error);
      setError('검색 결과를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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

  const handlePatientClick = async (patient) => {
    setSelectedPatientId(patient.id);
    const deviceStatusId = await fetchDeviceStatusId(patient.id);
    setSelectedDeviceStatusId(deviceStatusId);
    setSelectedPatientInfo(patient);
  };

  const fetchAssignedPatientsWithDeviceStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const data = await getRequest(application, '/doctor/patients', token);

      const patientsWithDeviceStatus = await Promise.all(
        data.patients
          .filter((patient) => patient.name !== 'chatbot')
          .map(async (patient) => {
            let deviceStatusId = null;
            if (assignedPatients.includes(patient.id)) {
              deviceStatusId = await fetchDeviceStatusId(patient.id);
            }
            return { ...patient, device_status_id: deviceStatusId };
          })
      );

      setPatients(patientsWithDeviceStatus);
    } catch (error) {
      console.error('Error fetching assigned patients:', error);
      setError('환자 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [assignedPatients, fetchDeviceStatusId, application]);

  const loadAssignedPatientsFromLocalStorage = () => {
    const storedAssignedPatients = localStorage.getItem('assignedPatients');
    if (storedAssignedPatients) {
      setAssignedPatients(JSON.parse(storedAssignedPatients));
    }
  };

  const registerPatient = async (patientId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await postRequest(application, `/doctor/${patientId}`, {}, token);
      alert('담당 환자로 등록되었습니다.');
      const updatedAssignedPatients = [...assignedPatients, patientId];
      setAssignedPatients(updatedAssignedPatients);
      localStorage.setItem('assignedPatients', JSON.stringify(updatedAssignedPatients));
      fetchAssignedPatientsWithDeviceStatus();
    } catch (error) {
      console.error('Error registering patient:', error);
      alert('담당 환자로 등록하는 데 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const removePatient = async (patientId) => {
    try {
      const token = localStorage.getItem('accessToken');
      await deleteRequest(application, `/doctor/${patientId}`, token);
      alert('담당 환자에서 삭제되었습니다.');
      const updatedAssignedPatients = assignedPatients.filter((id) => id !== patientId);
      setAssignedPatients(updatedAssignedPatients);
      localStorage.setItem('assignedPatients', JSON.stringify(updatedAssignedPatients));
      fetchAssignedPatientsWithDeviceStatus();
    } catch (error) {
      console.error('Error removing patient:', error);
      alert('담당 환자에서 삭제하는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    loadAssignedPatientsFromLocalStorage();
    fetchAssignedPatients();
  }, [fetchAssignedPatients]);

  useEffect(() => {
    if (assignedPatients.length > 0) {
      fetchAssignedPatientsWithDeviceStatus();
    }
  }, [assignedPatients, fetchAssignedPatientsWithDeviceStatus]);

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
        <button
          onClick={() => setSearchAssignedOnly(!searchAssignedOnly)}
          className="toggle-search-button"
        >
          {searchAssignedOnly ? '전체 환자 검색' : '담당 환자 검색'}
        </button>
      </div>

      <div className="patient-list">
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul>
            {(isSearching && patients.length > 0
              ? patients
              : patients.filter((patient) => assignedPatients.includes(patient.id))
            ).map((patient) =>
              patient.name !== 'chatbot' && (
<li key={patient.id} onClick={() => handlePatientClick(patient)}>
  <div className="patient-info-row compact">
    <p>
      <strong>{patient.name}</strong> ({patient.nickname})
    </p>
    {assignedPatients.includes(patient.id) ? (
      <button
        onClick={(e) => {
          e.stopPropagation(); // 버튼 클릭 시 환자 선택 방지
          removePatient(patient.id);
        }}
        className="compact-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', color: 'red' }}>
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
      </button>
    ) : (
      <button
        onClick={(e) => {
          e.stopPropagation(); // 버튼 클릭 시 환자 선택 방지
          registerPatient(patient.id);
        }}
        className="compact-button"
      >
        담당 환자로 등록
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
