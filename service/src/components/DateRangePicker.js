import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

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

export default DateRangePicker;
