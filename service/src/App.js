import React, { useState } from 'react';
import './UserSearchApp.css'; // CSS 파일 추가
import Profile from './components/Profile';
import SearchBar from './components/SearchBar';
import SortOptions from './components/SortOptions';
import UserList from './components/UserList';
import UserInfo from './components/UserInfo';
import PatientRecord from './components/PatientRecord';
import RecordList from './components/RecordList';
import RecordDetails from './components/RecordDetails';

const App = () => {
  const users = [
    {
      id: 1,
      name: 'Alice 강',
      height: '165cm',
      weight: '60kg',
      disease: 'Diabetes',
      other: 'No comments',
      birthdate: '1990-02-15',
    },
    {
      id: 2,
      name: 'Bob Smith',
      height: '180cm',
      weight: '75kg',
      disease: 'Hypertension',
      other: 'Check regularly',
      birthdate: '1985-05-22',
    },
    {
      id: 3,
      name: '길동 강',
      height: '170cm',
      weight: '65kg',
      disease: 'covid',
      other: 'cheer up',
      birthdate: '2000-07-30',
    },
  ];

  const [selectedUser, setSelectedUser] = useState(users[0]); // 기본적으로 첫 유저 선택
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name'); // 정렬 기준 상태 추가
  const [records, setRecords] = useState({}); // 모든 유저의 진료 기록 저장
  const [selectedRecord, setSelectedRecord] = useState(null); // 선택된 진료 기록
  const [medicationTemplates, setMedicationTemplates] = useState([]); // 약물 템플릿 상태

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
    return records[selectedUser.id] || [];
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
            <UserInfo user={selectedUser} />
            <PatientRecord
              addRecord={addRecord}
              medicationTemplates={medicationTemplates}
              addTemplate={addTemplate}
            /> {/* 진료 기록 입력 */}
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
