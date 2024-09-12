/*
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

//import './App.css';

import Chart from "./component/Layout/Chart/Chart";
import Profile from "./component/Layout/Profile/Profile";

function App() {
  return (
    <div className="App">
      <Profile />
      <Chart />
    </div>
  );
}

export default App;
*/
import React, { useState } from 'react';
import './UserSearchApp.css'; // CSS 파일 추가
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { subWeeks, subMonths } from 'date-fns';

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
      gallery: [
        { url: 'image1.jpg', date: '2024-09-01' },
        { url: 'image2.jpg', date: '2024-10-01' },
        { url: 'image1.jpg', date: '2024-04-26' },
        { url: 'image1.jpg', date: '2024-08-02' },
        { url: 'image1.jpg', date: '2024-06-03' },
        { url: 'image1.jpg', date: '2024-07-27' },
        { url: 'image1.jpg', date: '2024-03-27' },
      ],
    },
    {
      id: 2,
      name: 'Bob Smith',
      height: '180cm',
      weight: '75kg',
      disease: 'Hypertension',
      other: 'Check regularly',
      birthdate: '1985-05-22',
      gallery: [
        { url: 'image2.jpg', date: '2024-07-10' },
        { url: 'image1.jpg', date: '2024-03-27' },
        { url: 'image2.jpg', date: '2024-06-07' },
        { url: 'image2.jpg', date: '2024-07-10' },
        { url: 'image2.jpg', date: '2024-07-13' },
        { url: 'image2.jpg', date: '2024-04-08' },
        { url: 'image2.jpg', date: '2024-04-20' },
        { url: 'image2.jpg', date: '2024-08-17' },
        { url: 'image2.jpg', date: '2024-06-03' },
      ],
    },
    {
      id: 3,
      name: '길동 강',
      height: '170cm',
      weight: '65kg',
      disease: 'covid',
      other: 'cheer up',
      birthdate: '2000-07-30',
      gallery: [
        { url: 'image1.jpg', date: '2024-06-15' },
        { url: 'image3.jpg', date: '2024-09-10' },
      ],
    },
  ];

  const [selectedUser, setSelectedUser] = useState(users[0]); // 기본적으로 첫 유저 선택
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [sortOption, setSortOption] = useState('name'); // 정렬 기준 상태 추가
  const [galleryPeriod, setGalleryPeriod] = useState('all'); // 갤러리 기간 필터

  // 정렬 함수
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

  // 정렬된 유저를 필터링
  const filteredUsers = sortedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setSelectedDates([start, end]);
  };

  // 이미지 날짜에 따른 필터링 및 정렬
  const filterImagesByDate = (images, period) => {
    const now = new Date();
    let filteredImages = images;

    if (period === '1week') {
      filteredImages = images.filter(image => new Date(image.date) >= subWeeks(now, 1));
    } else if (period === '1month') {
      filteredImages = images.filter(image => new Date(image.date) >= subMonths(now, 1));
    } else if (period === '3months') {
      filteredImages = images.filter(image => new Date(image.date) >= subMonths(now, 3));
    } else if (period === '6months') {
      filteredImages = images.filter(image => new Date(image.date) >= subMonths(now, 6));
    }

    return filteredImages.sort((a, b) => new Date(b.date) - new Date(a.date)); // 날짜별 내림차순 정렬
  };

  // 필터링된 갤러리 이미지를 표시
  const filteredImages = filterImagesByDate(selectedUser.gallery, galleryPeriod);

  return (
    <div className="user-search-app">
      <div className="left-panel">
        <Profile />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
        <UserList users={filteredUsers} setSelectedUser={setSelectedUser} />
      </div>
      <div className="right-panel">
        <DateRangePicker selectedDates={selectedDates} handleDateChange={handleDateChange} />
        <UserInfo user={selectedUser} />
        <GalleryPeriodFilter setGalleryPeriod={setGalleryPeriod} />
        <Gallery images={filteredImages} /> {/* 기간에 따른 필터링된 갤러리 */}
      </div>
    </div>
  );
};
// 정렬 옵션 컴포넌트
const SortOptions = ({ sortOption, setSortOption }) => {
  return (
    <div className="sort-options">
      <label htmlFor="sort"> </label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="name">이름 순</option>
        <option value="id">ID 순</option>
        <option value="birthdate">생년월일 순</option>
      </select>
    </div>
  );
};

// 날짜 선택 컴포넌트
const DateRangePicker = ({ selectedDates, handleDateChange }) => {
  return (
    <div className="date-range-picker">
      <DatePicker
        selectsRange
        locale={ko} // 한글로 설정
        dateFormat="yyyy년 MM월 dd일"
        startDate={selectedDates[0]}
        endDate={selectedDates[1]}
        maxDate={new Date()} // 최대 선택 가능 날짜를 오늘로 설정
        onChange={handleDateChange} // 날짜 변경 시 실행될 함수
        isClearable // 날짜 선택 취소 기능
      />
    </div>
  );
};
// 기간 필터 컴포넌트
const GalleryPeriodFilter = ({ setGalleryPeriod }) => {
  return (
    <div className="gallery-period-filter">
      <label>기간</label>
      <select onChange={(e) => setGalleryPeriod(e.target.value)}>
        <option value="all">전체</option>
        <option value="1week">1주</option>
        <option value="1month">1개월</option>
        <option value="3months">3개월</option>
        <option value="6months">6개월</option>
      </select>
    </div>
  );
};

// 갤러리 컴포넌트
const Gallery = ({ images }) => {
  return (
    <div className="gallery">
      {images.length > 0 ? (
        images.map((image, index) => (
          <div key={index} className="gallery-item">
            <img src={image.url} alt={`gallery-${index}`} />
            <p>{image.date}</p> {/* 이미지의 날짜 표시 */}
          </div>
        ))
      ) : (
        <p>해당 기간에 이미지가 없습니다.</p>
      )}
    </div>
  );
};

// 유저 정보 표시 컴포넌트
const UserInfo = ({ user }) => {
  return (
    <div className="user-info">
      <h1>환자정보</h1>
      <p><strong>이름:</strong> {user.name}</p>
      <p><strong>생년월일:</strong> {user.birthdate}</p>
      <p><strong>키:</strong> {user.height}</p>
      <p><strong>몸무게:</strong> {user.weight}</p>
      <p><strong>병명:</strong> {user.disease}</p>
      <p><strong>기타 사항:</strong> {user.other}</p>
    </div>
  );
};

const Profile = () => {
  return (
    <div className="profile">
      <h2>프로필자리</h2>
    </div>
  );
};

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="유저 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

// 유저 리스트 컴포넌트
const UserList = ({ users, setSelectedUser }) => {
  return (
    <div className="user-list">
      {users.length > 0 ? (
        users.map((user) => (
          <div
            key={user.id}
            className="user-item"
            onClick={() => setSelectedUser(user)} // 유저 클릭 시 선택
          >
            {user.name}
          </div>
        ))
      ) : (
        <p>해당하는 유저가 없습니다.</p>
      )}
    </div>
  );
};

export default App;
