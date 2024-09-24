// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios 추가
import './UserSearchApp.css';
import Profile from './components/Profile';
import SearchBar from './components/SearchBar';
import SortOptions from './components/SortOptions';
import UserList from './components/UserList';
import UserInfo from './components/UserInfo';
import RecordList from './components/RecordList';
import RecordDetails from './components/RecordDetails';

const App = () => {
  const [users, setUsers] = useState([]); // 유저 데이터 상태
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 유저
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name'); // 정렬 기준 상태
  const [records, setRecords] = useState({}); // 모든 유저의 진료 기록 저장
  const [selectedRecord, setSelectedRecord] = useState(null); // 선택된 진료 기록
  const [medicationTemplates, setMedicationTemplates] = useState([]); // 약물 템플릿 상태

  // useEffect를 사용하여 유저 데이터 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://172.30.1.125:8001/patients');
        setUsers(response.data); // 가져온 데이터를 users 상태에 저장
        if (response.data.length > 0) {
          setSelectedUser(response.data[0]); // 첫 번째 유저를 기본 선택
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 유저 정렬 함수
  const sortedUsers = [...users].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'id') {
      return a.id - b.id;
    } else if (sortOption === 'birthdate') {
      return new Date(a.birthdate) - new Date(b.birthdate);
    }
    return 0;
  });

  // 정렬된 유저를 검색어로 필터링
  const filteredUsers = sortedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 특정 유저의 기록 가져오기
  const getUserRecords = () => {
    return records[selectedUser?.id] || [];
  };

  // 약물 템플릿 추가 함수
  const addTemplate = (template) => {
    setMedicationTemplates([...medicationTemplates, template]);
  };

  // 기록 추가 함수
  const addRecord = (record) => {
    const userRecords = getUserRecords();
    const newRecords = { ...records, [selectedUser.id]: [...userRecords, record] };
    setRecords(newRecords);
  };

  return (
    <div className="user-search-app">
      <div className="left-panel">
        <Profile />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
        <UserList users={filteredUsers} setSelectedUser={setSelectedUser} /> {/* 정렬된 유저 목록 전달 */}
      </div>
      <div className="right-panel">
        <div className="user-info-record-list">
          <div className="user-info-record">
            {selectedUser && <UserInfo user={selectedUser} />} {/* 선택된 유저 정보 표시 */}
            {/*
            <PatientRecord
              addRecord={addRecord}
              medicationTemplates={medicationTemplates}
              addTemplate={addTemplate}
            />
            진료 기록 입력 컴포넌트 
            */}
          </div>
          <RecordList
            records={getUserRecords()}
            setSelectedRecord={setSelectedRecord}
          /> {/* 진료 기록 목록 */}
          <RecordDetails record={selectedRecord} /> {/* 진료 기록 상세 보기 */}
        </div>
      </div>
    </div>
  );
};

export default App;
