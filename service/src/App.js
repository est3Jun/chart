import React, { useState } from 'react';
import './UserSearchApp.css'; // CSS 파일 추가
import { subWeeks, subMonths } from 'date-fns';
import Profile from './components/Profile';
import SearchBar from './components/SearchBar';
import SortOptions from './components/SortOptions';
import UserList from './components/UserList';
import DateRangePicker from './components/DateRangePicker';
import UserInfo from './components/UserInfo';
import GalleryPeriodFilter from './components/GalleryPeriodFilter';
import Gallery from './components/Gallery';

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
        <Gallery images={filteredImages} />
      </div>
    </div>
  );
};

export default App;
