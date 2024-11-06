import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getRequest } from '../UrlRequest';
import DataChart from './DataChart';

const Pulse = ({ patientId, selectedDate, selectedPeriod, onPeriodChange }) => {
  const [pulseData, setPulseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const application = location.state?.application || 'hearton';

  useEffect(() => {
    const fetchPulseData = async () => {
      if (!patientId || !selectedDate) return;

      setLoading(true);
      setError(null);
      setPulseData(null); // 날짜 변경 시 기존 데이터 초기화

      try {
        const token = localStorage.getItem('accessToken');

        // 선택한 날짜의 맥박 데이터를 가져옴
        const dailyResponse = await getRequest(application, `/doctor/${patientId}/pulse/daily?on-date=${selectedDate}`, token);

        // 선택한 기간의 평균 맥박 데이터를 가져옴
        const periodResponse = await getRequest(application, `/doctor/${patientId}/pulse/period?on-date=${selectedDate}&period=${selectedPeriod}`, token);

        // dailyResponse에서 맥박 데이터 확인
        if (dailyResponse && dailyResponse.heart_rate !== undefined) {
          setPulseData({
            pulse_rate: dailyResponse.heart_rate,
            avg_heart_rate: periodResponse?.avg_heart_rate || []
          });
        } else if (periodResponse && periodResponse.avg_heart_rate?.length > 0) {
          // 일별 데이터가 없으나 기간 내 평균 맥박 데이터가 있을 경우
          setPulseData({
            pulse_rate: `${selectedDate}에 대한 맥박 데이터가 없습니다.`,
            avg_heart_rate: periodResponse.avg_heart_rate
          });
        } else {
          setError(`${selectedDate}에 대한 맥박 데이터가 없습니다.`);
        }
      } catch (error) {
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchPulseData();
  }, [patientId, selectedDate, selectedPeriod, application]);

  const handlePeriodChange = (period) => {
    onPeriodChange(period); // 부모 컴포넌트로 선택된 기간을 업데이트
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div>
      <h3>맥박</h3>
      {pulseData && typeof pulseData.pulse_rate === 'number' ? (
        <p>맥박: {pulseData.pulse_rate} bpm</p>
      ) : (
        <p>{selectedDate}에 대한 맥박 데이터가 없습니다.</p>
      )}
      <DataChart
        patientId={patientId}
        dataType="pulse"
        endpoint={`/doctor/${patientId}/pulse/period`}
        label="맥박"
        selectedDate={selectedDate}
        selectedPeriod={selectedPeriod}
      />
      {error && <p>{error}</p>}
    </div>
  );
};

export default Pulse;
