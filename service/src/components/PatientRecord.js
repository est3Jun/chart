import React, { useState } from 'react';
import MedicationTemplate from './MedicationTemplate';

const PatientRecord = ({ addRecord, medicationTemplates, addTemplate }) => {
  const [form, setForm] = useState({
    diagnosis: '',
    notes: '',
    medication: '' // 약물 필드
  });
  const [image, setImage] = useState(null); // 이미지 파일을 저장할 상태

  // 기록 추가 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0]; // 오늘 날짜
    const record = { ...form, date: today, image }; // 오늘 날짜와 이미지 포함하여 기록 생성
    addRecord(record);
    setForm({ diagnosis: '', notes: '', medication: '' }); // 폼 초기화
    setImage(null); // 이미지 상태 초기화
  };

  // 폼 데이터 변경 함수
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 이미지 변경 함수 (이미지 미리보기는 없앰)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // 이미지 파일만 저장하고 미리보기는 보여주지 않음
    }
  };

  // 템플릿 선택 시 약물 정보 자동 입력
  const handleTemplateSelect = (template) => {
    setForm({ ...form, medication: `${template.name} - ${template.dose}, ${template.frequency}` });
  };

  return (
    <div className="patient-record">
      <h2>진료 기록 작성</h2>
      <form onSubmit={handleSubmit} className="record-form">
        <div>
          <label>진단명:</label>
          <input
            type="text"
            name="diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>비고:</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label>약물 추가:</label>
          <textarea
            name="medication"
            value={form.medication}
            onChange={handleChange}
            required
            placeholder="약물명, 용량, 복용 방법을 입력하세요."
          ></textarea>
        </div>
        <div>
          <label>이미지 첨부:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit">추가</button>
      </form>
      <MedicationTemplate
        templates={medicationTemplates}
        addTemplate={addTemplate}
        onTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
};

export default PatientRecord;
