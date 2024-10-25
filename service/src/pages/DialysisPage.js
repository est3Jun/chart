import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Pulse from '../components/rightpannel/Pulse';
import Weight from '../components/rightpannel/Weight';
import BloodPressure from '../components/rightpannel/BloodPressure';
import Diet from '../components/rightpannel/Diet';
import Condition from '../components/rightpannel/Condition';
import DatePickerComponent from '../components/rightpannel/DatePickerComponent';
import DeviceStatusForm from '../components/DeviceStatusForm';
import PatientInfo from '../components/rightpannel/PatientInfo';
import './DashboardPage.css';

const DialysisPage = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [deviceStatusId, setDeviceStatusId] = useState(null);
  const [recordType, setRecordType] = useState('pulse'); // 기본값: 맥박
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(7); // 기본 7일

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period); // 선택한 기간 설정
  };

  const handleRecordTypeChange = (type) => {
    setRecordType(type); // 기록 유형 설정
  };

  return (
    <div className="dashboard">
      <div className="left-panel">
        <Sidebar 
          setSelectedPatientId={setSelectedPatientId} 
          setSelectedDeviceStatusId={setDeviceStatusId}
          setSelectedPatientInfo={setSelectedPatientInfo}
        />
      </div>

      <div className="right-panel">
        <div className="patient-info">
          <PatientInfo patient={selectedPatientInfo} />
        </div>        
        {selectedPatientId && (

            <DatePickerComponent
              patientId={selectedPatientId}
              onDateSelect={handleDateSelect}
              onPeriodSelect={handlePeriodSelect}
              recordType={recordType}
            />
        )}



        {selectedPatientId && (
          <>
            <div className="component1 chart-container" onClick={() => handleRecordTypeChange('pulse')}>
              <Pulse
                patientId={selectedPatientId}
                selectedDate={selectedDate}
                selectedPeriod={selectedPeriod} // 기간 전달
              />
            </div>
            <div className="component1 chart-container" onClick={() => handleRecordTypeChange('weight')}>
              <Weight patientId={selectedPatientId} selectedDate={selectedDate} selectedPeriod={selectedPeriod} />
            </div>
            <div className="component1 chart-container" onClick={() => handleRecordTypeChange('blood-pressure')}>
              <BloodPressure patientId={selectedPatientId} selectedDate={selectedDate} selectedPeriod={selectedPeriod} />
            </div>
            <div className="component1 chart-container" onClick={() => handleRecordTypeChange('meal')}>
              <Diet patientId={selectedPatientId} selectedDate={selectedDate} selectedPeriod={selectedPeriod} />
            </div>
            <div className="component1 chart-container" onClick={() => handleRecordTypeChange('health-condition')}>
              <Condition patientId={selectedPatientId} selectedDate={selectedDate} selectedPeriod={selectedPeriod} />
            </div>
            <div className="component1 device-status-form">
              <DeviceStatusForm
                patientId={selectedPatientId}
                deviceStatusId={deviceStatusId}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default DialysisPage;
