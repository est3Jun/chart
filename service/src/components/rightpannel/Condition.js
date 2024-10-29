import React, { useEffect, useState } from 'react';
import { getRequest, getBaseUrl } from '../UrlRequest';
import { useLocation } from 'react-router-dom';

const Condition = ({ patientId, selectedDate }) => {
  const [conditionData, setConditionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [surgeryImage, setSurgeryImage] = useState(null);
  const location = useLocation();
  const application = location.state?.application || 'hearton';

  const fetchSurgeryImage = async (healthConditionId, token) => {
    try {
      const response = await fetch(`${getBaseUrl(application)}/doctor/${healthConditionId}/surgery-image`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      if (!response.ok) throw new Error('이미지를 불러오지 못했습니다.');
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(`Health Condition ID ${healthConditionId} 이미지 오류:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchConditionData = async () => {
      setConditionData(null);
      setError(null);
      setLoading(true);
      setSurgeryImage(null);

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('인증 토큰이 없습니다.');
          setLoading(false);
          return;
        }

        const data = await getRequest(application, `/doctor/${patientId}/health-condition/daily?on-date=${selectedDate}`, token);
        if (data) {
          setConditionData(data);

          // health_condition_id가 있는 경우 이미지 가져오기
          if (data.health_condition_id) {
            const imageUrl = await fetchSurgeryImage(data.health_condition_id, token);
            setSurgeryImage(imageUrl);
          }
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

      {/* 이미지 표시 */}
      {surgeryImage ? (
        <div>
          <h4>수술 이미지</h4>
          <img src={surgeryImage} alt="수술 이미지" style={{ width: '100%', maxWidth: '300px' }} />
        </div>
      ) : (
        <p>이미지를 불러오는 중입니다...</p>
      )}
    </div>
  ) : (
    <p>{selectedDate}에 대한 건강 상태 데이터가 없습니다.</p>
  );
};

export default Condition;
