import React, { useEffect, useState } from 'react';
import { getRequest } from '../UrlRequest';
import DataChart from './DataChart';
import { useLocation } from 'react-router-dom';

const Weight = ({ patientId, selectedDate, selectedPeriod }) => {
  const [weightData, setWeightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const application = location.state?.application || 'hearton';

  useEffect(() => {
    const fetchWeightData = async () => {
      if (!patientId || !selectedDate) return;

      setLoading(true);
      setError(null);
      setWeightData(null); // 날짜 변경 시 기존 데이터 초기화

      try {
        const token = localStorage.getItem('accessToken');

        // 기간 내 평균 체중 데이터를 먼저 가져옴
        const periodResponse = await getRequest(application,
          `/doctor/${patientId}/weight/period?on-date=${selectedDate}&period=${selectedPeriod}`,
          token
        );

        // am_weight와 pm_weight 데이터 가져옴
        const dailyResponse = await getRequest(application,
          `/doctor/${patientId}/weight/daily?on-date=${selectedDate}`,
          token
        );

        // am_weight 또는 pm_weight 중 하나라도 있으면 dailyResponse 사용
        if (dailyResponse && (dailyResponse.am_weight || dailyResponse.pm_weight)) {
          setWeightData({ 
            am_weight: dailyResponse.am_weight || `${selectedDate}에 대한 체중 데이터가 없습니다.`, 
            pm_weight: dailyResponse.pm_weight || `${selectedDate}에 대한 체중 데이터가 없습니다.`, 
            avg_weight: periodResponse?.avg_weights || []
          });
        } else if (periodResponse && periodResponse.avg_weights?.length > 0) {
          // 일별 데이터가 없으나 기간 내 평균 체중 데이터가 있을 경우
          setWeightData({ 
            am_weight: `${selectedDate}에 대한 체중 데이터가 없습니다.`, 
            pm_weight: `${selectedDate}에 대한 체중 데이터가 없습니다.`, 
            avg_weight: periodResponse.avg_weights 
          });
        } else {
          setError('해당 날짜와 기간에 체중 데이터가 없습니다.');
        }
      } catch (error) {
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchWeightData();
  }, [application, patientId, selectedDate, selectedPeriod]);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div>
      <h3>체중(kg)</h3>
      {weightData ? (
        <>
          <p>아침: {weightData.am_weight}</p>
          <p>저녁: {weightData.pm_weight}</p>
        </>
      ) : (
        <p>{selectedDate}에 대한 체중 데이터가 없습니다.</p>
      )}
      <DataChart
        patientId={patientId}
        dataType="weight"
        endpoint={`/doctor/${patientId}/weight/period`}
        label="평균 체중"
        periodOptions={[]} // 버튼 비활성화
        selectedDate={selectedDate}
        selectedPeriod={selectedPeriod}
      />
      {error && <p>{error}</p>}
    </div>
  );
};

export default Weight;
