import React, { useState } from 'react';

const RecordList = ({ records, deleteRecord, updateRecord, setSelectedRecord }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ date: '', diagnosis: '', notes: '', medication: '' }); // "치료 계획"과 "후속 조치" 대신 "medication" 필드 사용

  // 수정 모드로 변경하는 함수
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditForm(records[index]);
  };

  // 수정 취소
  const handleCancel = () => {
    setEditIndex(null);
    setEditForm({ date: '', diagnosis: '', notes: '', medication: '' });
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

  // 기록 항목 클릭 시, 해당 기록을 상세 보기 컴포넌트에 표시
  const handleRecordClick = (record) => {
    setSelectedRecord(record); // 선택된 기록을 상위 컴포넌트로 전달
  };

  return (
    <div className="record-list">
      <h3>진료 기록 목록</h3>
      <ul>
        {records.length > 0 ? (
          records.map((record, index) => (
            <li
              key={index}
              className="record-item"
              onClick={() => handleRecordClick(record)} // 각 기록을 클릭하면 해당 기록이 상세 보기에 표시됨
            >
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
                  <textarea
                    name="medication"
                    value={editForm.medication}
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
                  <strong>약물:</strong> {record.medication} <br />
                  <div className="record-actions">
                    <button onClick={() => handleEdit(index)}>수정</button>
                    <button onClick={() => deleteRecord(index)}>삭제</button>
                  </div>
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
