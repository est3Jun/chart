import React, { useState } from 'react';
import Diet from './Diet';
import Condition from './Condition';
import DeviceStatusForm from '../DeviceStatusForm';

const Tabs = ({ patientId, selectedDate, deviceStatusId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isListView, setIsListView] = useState(true); // 리스트와 폼 전환 상태

  // 리스트와 폼 화면 전환 함수
  const toggleView = () => {
    setIsListView(!isListView);
  };

  const tabs = [
    { label: '식단', component: <Diet patientId={patientId} selectedDate={selectedDate} /> },
    { label: '건강 상태', component: <Condition patientId={patientId} selectedDate={selectedDate} /> },
    { 
      label: '기기 상태', 
      component: <DeviceStatusForm patientId={patientId} deviceStatusId={deviceStatusId} isListView={isListView} />
    },
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
        {/* 기기 상태 탭이 선택된 경우에만 전환 버튼을 표시 */}
        {activeTab === 2 && (
          <button onClick={toggleView} className="toggle-view-button">
            {isListView ? '기기 상태 작성/수정' : '기기 상태 목록 보기'}
          </button>
        )}
      </div>
      <div className="tab-content" style={{ height: '500px', overflowY: 'auto' }}>
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default Tabs;
