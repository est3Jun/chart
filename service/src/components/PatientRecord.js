import React, { useState } from 'react';

const PatientRecord = ({ addRecord }) => {
  const [form, setForm] = useState({ diagnosis: '', notes: '' });
  const [image, setImage] = useState(null); // 이미지 파일을 저장할 상태

  // 기록 추가 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜
    const record = { ...form, date: today, image }; // 오늘 날짜와 이미지 포함하여 기록 생성
    addRecord(record);
    setForm({ diagnosis: '', notes: '' });
    setImage(null); // 이미지 상태 초기화
  };

  // 폼 데이터 변경 함수
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 이미지 변경 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // 이미지 미리보기 URL 생성
    }
  };

  return (
    <div className="patient-record">
      <h2>진료 기록 작성</h2>
      <form onSubmit={handleSubmit} className="record-form">
        <div>
          <label>진단명:</label>
          <input
            type="text"
            name="diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>비고:</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label>이미지 첨부:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {image && <img src={image} alt="미리보기" className="image-preview" />} {/* 이미지 미리보기 */}
        </div>
        <button type="submit">추가</button>
      </form>
    </div>
  );
};

export default PatientRecord;
