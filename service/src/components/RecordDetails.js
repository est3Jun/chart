import React from 'react';

const RecordDetails = ({ record }) => {
  if (!record) {
    return <div className="record-details">선택된 진료 기록이 없습니다.</div>;
  }

  // 이미지 URL 생성
  const imageUrl = record.image ? URL.createObjectURL(record.image) : null;

  return (
    <div className="record-details">
      <h3>진료 기록 상세 정보</h3>
      <p><strong>날짜:</strong> {record.date}</p>
      <p><strong>진단명:</strong> {record.diagnosis}</p>
      <p><strong>비고:</strong> {record.notes}</p>
      <p><strong>약물:</strong> {record.medication}</p>
      <p><strong>담당 의사:</strong> {record.doctor}</p>
      {record.image && (
        <div>
          <strong>첨부 이미지:</strong> <br />
          <img src={imageUrl} alt="첨부 이미지" className="image-preview" />
        </div>
      )}
    </div>
  );
};

export default RecordDetails;
