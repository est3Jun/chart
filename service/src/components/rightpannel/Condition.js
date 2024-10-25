import React, { useEffect, useState } from 'react';
import { getRequest } from '../UrlRequest';
import {useLocation} from 'react-router-dom'; //상태로 application 수신받고 url 분리용

const Condition = ({ patientId, selectedDate }) => {
  const [conditionData, setConditionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const application = location.state?.application || 'hearton'; //기본값은 hearton으로 설정

  useEffect(() => {
    const fetchConditionData = async () => {
      // 상태 초기화
      setConditionData(null);
      setError(null);
      setLoading(true);

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('인증 토큰이 없습니다.');
          setLoading(false);
          return;
        }

        const data = await getRequest(application, `/doctor/${patientId}/health-condition/daily?on-date=${selectedDate}`, token);
        if (data) {
          setConditionData(data); // 데이터가 있으면 설정
        } else {
          setError('해당 날짜에 건강 상태 데이터가 없습니다.');
        }
      } catch (error) {
        setError('건강 상태 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (patientId && selectedDate) {
      fetchConditionData();
    }
  }, [application, patientId, selectedDate]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return conditionData ? (
    <div>
      <h3>건강 상태</h3>
      <p><strong>실신:</strong> {conditionData.fainting}</p>
      <p><strong>소변 감소:</strong> {conditionData.urine_reduction}</p>
      <p><strong>불편감:</strong> {conditionData.discomfort}</p>
      {conditionData.discomfort === '있음' && (
        <p><strong>불편감 증상:</strong> {conditionData.discomfort_symptom || '없음'}</p>
      )}
      <p><strong>식사 상태:</strong> {conditionData.diet_status}</p>
      <p><strong>운동 빈도:</strong> {conditionData.exercise_frequency}</p>
      <p><strong>심박수:</strong> {conditionData.heart_rate} BPM</p>
      <p><strong>수술 부위 상태:</strong> {conditionData.surgery_site_condition}</p>
      {conditionData.surgery_site_condition === '열감' && (
        <p><strong>수술 부위 증상:</strong> {conditionData.surgery_site_symptom || '없음'}</p>
      )}
      <p><strong>부종:</strong> {conditionData.edema}</p>
      <p><strong>심부전 클래스:</strong> {conditionData.heart_failure_class}</p>
      <p><strong>약물 복용 상태:</strong> {conditionData.medication_status}</p>
    </div>
  ) : (
    <p>{selectedDate}에 대한 건강 상태 데이터가 없습니다.</p>
  );
};

export default Condition;
