import React, { useState, useEffect } from 'react';

const PatientRecord = ({ userId }) => {
  const [records, setRecords] = useState({});
  const [form, setForm] = useState({ date: '', diagnosis: '', notes: '' });
  const [editIndex, setEditIndex] = useState(null);

  // 특정 유저의 기록 가져오기
  const getUserRecords = () => {
    return records[userId] || [];
  };

  // 기록 추가 또는 수정 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecords = { ...records };
    const userRecords = getUserRecords();

    if (editIndex !== null) {
      // 수정 모드
      userRecords[editIndex] = form;
      newRecords[userId] = userRecords;
    } else {
      // 추가 모드
      newRecords[userId] = [...userRecords, form];
    }

    setRecords(newRecords);
    setForm({ date: '', diagnosis: '', notes: '' });
    setEditIndex(null);
  };

  // 기록 삭제 함수
  const handleDelete = (index) => {
    const newRecords = { ...records };
    newRecords[userId] = newRecords[userId].filter((_, i) => i !== index);
    setRecords(newRecords);
  };

  // 수정 모드로 변경하는 함수
  const handleEdit = (index) => {
    setForm(getUserRecords()[index]);
    setEditIndex(index);
  };

  // 폼 데이터 변경 함수
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 선택된 유저 변경 시 폼 초기화
  useEffect(() => {
    setForm({ date: '', diagnosis: '', notes: '' });
    setEditIndex(null);
  }, [userId]);

  return (
    <div className="patient-record">
      <h2>진료 기록</h2>
      <form onSubmit={handleSubmit} className="record-form">
        <div>
          <label>날짜:</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
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
        <button type="submit">
          {editIndex !== null ? '수정' : '추가'}
        </button>
      </form>

      <h3>기록 목록</h3>
      <ul className="record-list">
        {getUserRecords().length > 0 ? (
          getUserRecords().map((record, index) => (
            <li key={index} className="record-item">
              <strong>날짜:</strong> {record.date} <br />
              <strong>진단명:</strong> {record.diagnosis} <br />
              <strong>비고:</strong> {record.notes}
              <div className="record-actions">
                <button onClick={() => handleEdit(index)}>수정</button>
                <button onClick={() => handleDelete(index)}>삭제</button>
              </div>
            </li>
          ))
        ) : (
          <p>기록이 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default PatientRecord;
