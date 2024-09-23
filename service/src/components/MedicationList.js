import React, { useState } from 'react';

const MedicationList = ({ medications, addMedication, updateMedication, deleteMedication }) => {
  const [newMedication, setNewMedication] = useState({ name: '', dose: '', frequency: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [editMedication, setEditMedication] = useState({ name: '', dose: '', frequency: '' });

  // 약물 추가 함수
  const handleAddMedication = () => {
    addMedication(newMedication);
    setNewMedication({ name: '', dose: '', frequency: '' });
  };

  // 약물 수정 모드로 전환
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditMedication(medications[index]);
  };

  // 수정된 약물 저장
  const handleSave = () => {
    updateMedication(editIndex, editMedication);
    setEditIndex(null);
    setEditMedication({ name: '', dose: '', frequency: '' });
  };

  // 수정 취소
  const handleCancel = () => {
    setEditIndex(null);
    setEditMedication({ name: '', dose: '', frequency: '' });
  };

  return (
    <div className="medication-list">
      <h3>약물 처방 목록</h3>
      <ul>
        {medications.map((medication, index) => (
          <li key={index} className="medication-item">
            {editIndex === index ? (
              <div>
                <input
                  type="text"
                  placeholder="약물명"
                  value={editMedication.name}
                  onChange={(e) => setEditMedication({ ...editMedication, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="용량"
                  value={editMedication.dose}
                  onChange={(e) => setEditMedication({ ...editMedication, dose: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="복용 빈도"
                  value={editMedication.frequency}
                  onChange={(e) => setEditMedication({ ...editMedication, frequency: e.target.value })}
                />
                <button onClick={handleSave}>저장</button>
                <button onClick={handleCancel}>취소</button>
              </div>
            ) : (
              <>
                <strong>약물명:</strong> {medication.name} <br />
                <strong>용량:</strong> {medication.dose} <br />
                <strong>복용 빈도:</strong> {medication.frequency} <br />
                <button onClick={() => handleEdit(index)}>수정</button>
                <button onClick={() => deleteMedication(index)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="add-medication">
        <h4>약물 추가</h4>
        <input
          type="text"
          placeholder="약물명"
          value={newMedication.name}
          onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="용량"
          value={newMedication.dose}
          onChange={(e) => setNewMedication({ ...newMedication, dose: e.target.value })}
        />
        <input
          type="text"
          placeholder="복용 빈도"
          value={newMedication.frequency}
          onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
        />
        <button onClick={handleAddMedication}>추가</button>
      </div>
    </div>
  );
};

export default MedicationList;
