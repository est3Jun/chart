import React, { useEffect, useState } from 'react';
import { getRequest } from '../UrlRequest';
import DataChart from './DataChart';
import {useLocation} from 'react-router-dom'; //상태로 application 수신받고 url 분리용

const Weight = ({ patientId, selectedDate, selectedPeriod }) => {
  const [weightData, setWeightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const application = location.state?.application || 'hearton'; //기본값은 hearton으로 설정

  useEffect(() => {
    const fetchWeightData = async () => {
      if (!patientId || !selectedDate) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('accessToken');
        const response = await getRequest(application,
          `/doctor/${patientId}/weight/period?on-date=${selectedDate}&period=${selectedPeriod}`,
          token
        );

        if (response && response.avg_weights) {
          setWeightData(response);
        } else {
          setError('해당 기간에 체중 데이터가 없습니다.');
        }
      } catch (error) {
        setError('체중 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeightData();
  }, [application, patientId, selectedDate, selectedPeriod]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return weightData ? (
    <div>
      <h3>체중</h3>
      <p>아침 체중: {weightData.am_weight} kg</p>
      <p>저녁 체중: {weightData.pm_weight} kg</p>
      <DataChart
  patientId={patientId}
  dataType="weight"
  endpoint={`/doctor/${patientId}/weight/period`}
  label="체중"
  periodOptions={[]} // 버튼 비활성화
  selectedDate={selectedDate}
  selectedPeriod={selectedPeriod}
/>

    </div>
  ) : (
    <p>{selectedDate}에 대한 체중 데이터가 없습니다.</p>
  );
};

export default Weight;
