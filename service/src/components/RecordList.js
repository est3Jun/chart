import React from 'react';

const RecordList = ({ records, setSelectedRecord }) => {
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
              <>
                <strong>날짜:</strong> {record.date} <br />
                <strong>진단명:</strong> {record.diagnosis} <br />
                <strong>비고:</strong> {record.notes} <br />
                {/* 아래 이미지 미리보기 부분을 삭제하거나 주석 처리하세요 */}
                {/* {record.image && <img src={record.image} alt="첨부 이미지" className="image-preview" />} */}
              </>
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
