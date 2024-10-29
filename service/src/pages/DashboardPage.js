import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Pulse from '../components/rightpannel/Pulse';
import Weight from '../components/rightpannel/Weight';
import BloodPressure from '../components/rightpannel/BloodPressure';
import PatientInfo from '../components/rightpannel/PatientInfo';
import PatientGrid from '../components/rightpannel/PatientGrid';
import Tabs from '../components/rightpannel/Tabs'; // 새로 추가한 탭 컴포넌트
import Diet from '../components/rightpannel/Diet'
import Chat from '../components/rightpannel/Chat';

import './DashboardPage.css';

const DashboardPage = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatientInfo, setSelectedPatientInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [deviceStatusId, setDeviceStatusId] = useState(null); 

  return (
    <div className="dashboard-container">
      <div className="grid-container">
        <div className="dashboard">
          <div className="sidebar">
            <Sidebar 
              setSelectedPatientId={setSelectedPatientId} 
              setSelectedPatientInfo={setSelectedPatientInfo}
              setSelectedDeviceStatusId={setDeviceStatusId}
            />
          </div>
  
          <div className="patientinfo">
            <PatientInfo patient={selectedPatientInfo} />
          </div>
  
          {selectedPatientId && (
            <>
              <div className="patientgrid">
                <PatientGrid 
                  patientId={selectedPatientId}
                  setSelectedDate={setSelectedDate}
                  setSelectedPeriod={setSelectedPeriod}
                />
              </div>
  
              <div className="diet">
                <Chat />
              </div>
              
              <div className="devicestatus">
                <Tabs patientId={selectedPatientId} selectedDate={selectedDate} deviceStatusId={deviceStatusId} />
              </div>
            </>
          )}
        </div>
      </div>
  
      <div className="stats-container">
        <div className="pulse">
          <Pulse patientId={selectedPatientId} selectedDate={selectedDate} selectedPeriod={selectedPeriod} />
        </div>
  
        <div className="weight">
          <Weight patientId={selectedPatientId} selectedDate={selectedDate} selectedPeriod={selectedPeriod} />
        </div>
  
        <div className="bloodpressure">
          <BloodPressure patientId={selectedPatientId} selectedDate={selectedDate} selectedPeriod={selectedPeriod} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
