import React from 'react';
import './PatientInfo.css'; // 스타일을 위한 CSS 파일 추가

const PatientInfo = ({ patient, selectedPeriod, onPeriodChange }) => {
  const periodOptions = [7, 30, 180, 365];

  return (
    <div className="patient-info-card">
      {patient ? (
        <div className="patient-details">
          <div>
            <strong>계정:</strong> <span className="patient-account">{patient.account}</span>
          </div>
          <div>
            <strong>이름:</strong> <span className="patient-name">{patient.name}</span>
          </div>
          <div>
            <strong>출생 연도:</strong> <span className="patient-birth-year">{patient.birth_year}</span>
          </div>
          <div>
            <strong>나이:</strong> <span className="patient-age">{patient.age}세</span>
          </div>
        </div>
      ) : (
        <p>환자를 선택해 주세요.</p>
      )}
      <div className="period-buttons">
        {periodOptions.map((period) => (
          <button
            key={period}
            className={selectedPeriod === period ? 'selected-period' : ''}
            onClick={() => onPeriodChange(period)}
          >
            {`${period}일`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatientInfo;
