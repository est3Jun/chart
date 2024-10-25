import React, { useState } from 'react';
import Diet from './Diet';
import Condition from './Condition';
import DeviceStatusForm from '../DeviceStatusForm';

const Tabs = ({ patientId, selectedDate, deviceStatusId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: '식단', component: <Diet patientId={patientId} selectedDate={selectedDate} /> },
    { label: '건강 상태', component: <Condition patientId={patientId} selectedDate={selectedDate} /> },
    { label: '기기 상태', component: <DeviceStatusForm patientId={patientId} deviceStatusId={deviceStatusId} /> },
  ];

  return (
    <div className="tab-container">
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={activeTab === index ? 'active-tab' : ''}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content" style={{ height: '500px', overflowY: 'auto' }}>
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default Tabs;
