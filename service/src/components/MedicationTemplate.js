import React, { useState } from 'react';

const MedicationTemplate = ({ templates, addTemplate, onTemplateSelect }) => {
  const [newTemplate, setNewTemplate] = useState({ name: '', dose: '', frequency: '' });

  // 템플릿 추가 함수
  const handleAddTemplate = () => {
    addTemplate(newTemplate);
    setNewTemplate({ name: '', dose: '', frequency: '' }); // 폼 초기화
  };

  return (
    <div className="medication-template">
      <h4>약물 템플릿</h4>
      <ul>
        {templates.map((template, index) => (
          <li key={index} className="template-item">
            <button onClick={() => onTemplateSelect(template)}>
              {template.name} - {template.dose}, {template.frequency}
            </button>
          </li>
        ))}
      </ul>
      <div className="add-template">
        <input
          type="text"
          placeholder="약물명"
          value={newTemplate.name}
          onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="용량"
          value={newTemplate.dose}
          onChange={(e) => setNewTemplate({ ...newTemplate, dose: e.target.value })}
        />
        <input
          type="text"
          placeholder="복용 빈도"
          value={newTemplate.frequency}
          onChange={(e) => setNewTemplate({ ...newTemplate, frequency: e.target.value })}
        />
        <button onClick={handleAddTemplate}>템플릿 추가</button>
      </div>
    </div>
  );
};

export default MedicationTemplate;
