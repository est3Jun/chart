import React, { useState } from 'react';

const RecordList = ({ records, deleteRecord, updateRecord }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ date: '', diagnosis: '', notes: '', image: '' });

  // 수정 모드로 변경하는 함수
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditForm(records[index]);
  };

  // 수정 취소
  const handleCancel = () => {
    setEditIndex(null);
    setEditForm({ date: '', diagnosis: '', notes: '', image: '' });
  };

  // 수정된 기록 저장
  const handleSave = () => {
    updateRecord(editIndex, editForm);
    handleCancel();
  };

  // 폼 데이터 변경 함수
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="record-list">
      <h3>진료 기록 목록</h3>
      <ul>
        {records.length > 0 ? (
          records.map((record, index) => (
            <li key={index} className="record-item">
              {editIndex === index ? (
                <div className="edit-form">
                  <input
                    type="text"
                    name="diagnosis"
                    value={editForm.diagnosis}
                    onChange={handleChange}
                  />
                  <textarea
                    name="notes"
                    value={editForm.notes}
                    onChange={handleChange}
                  ></textarea>
                  <div className="edit-actions">
                    <button onClick={handleSave}>저장</button>
                    <button onClick={handleCancel}>취소</button>
                  </div>
                </div>
              ) : (
                <>
                  <strong>날짜:</strong> {record.date} <br />
                  <strong>진단명:</strong> {record.diagnosis} <br />
                  <strong>비고:</strong> {record.notes} <br />
                  {record.image && <img src={record.image} alt="첨부 이미지" className="image-preview" />}
                </>
              )}
            </li>
          ))
        ) : (
          <p>기록이 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default RecordList;
