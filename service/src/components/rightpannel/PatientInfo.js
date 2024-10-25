import React from 'react';
//import './PatientInfo.css'; // 스타일을 위한 CSS 파일

const PatientInfo = ({ patient }) => {
  return (
    <div className="patient-info-card">
      {patient ? (
        <div className="patient-details">
          <span className="patient-account">{patient.account}</span>
          <span className="divider" />
          <span className="patient-name">{patient.name}</span>
          <span className="divider" />
          <span className="patient-nickname">{patient.nickname}</span>
          <span className="divider" />
          <span className="patient-age">{patient.age}세</span>
        </div>
      ) : (
        <p>환자를 선택해 주세요.</p>
      )}
    </div>
  );
};

export default PatientInfo;
