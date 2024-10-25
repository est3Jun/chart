import React, { useEffect, useState } from 'react';
import { getRequest } from '../UrlRequest';
import DataChart from './DataChart'; 
import {useLocation} from 'react-router-dom'; //상태로 application 수신받고 url 분리용

const BloodPressure = ({ patientId, selectedDate, selectedPeriod }) => {
  const [bloodPressureData, setBloodPressureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const application = location.state?.application || 'hearton'; //기본값은 hearton으로 설정


  useEffect(() => {
    const fetchBloodPressureData = async () => {
      if (!patientId || !selectedDate) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('accessToken');
        const response = await getRequest(application,
          `/doctor/${patientId}/blood-pressure/period?on-date=${selectedDate}&period=${selectedPeriod}`,
          token
        );

        if (response && response.systolics && response.diastolics) {
          setBloodPressureData(response); // 정상적으로 데이터를 저장
        } else {
          setError('해당 기간에 혈압 데이터가 없습니다.');
        }
      } catch (error) {
        setError('혈압 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBloodPressureData();
  }, [application, patientId, selectedDate, selectedPeriod]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return bloodPressureData ? (
    <div>
      <h3>혈압</h3>
      <p>수축기 혈압: {bloodPressureData.systolics.slice(-1)[0]} mmHg</p>
      <p>이완기 혈압: {bloodPressureData.diastolics.slice(-1)[0]} mmHg</p>
      <DataChart
  patientId={patientId}
  dataType="blood-pressure"
  endpoint={`/doctor/${patientId}/blood-pressure/period`}
  label="혈압"
  periodOptions={[]} // 빈 배열로 설정해 버튼이 렌더링되지 않게 함
  multipleLines={true}
  selectedDate={selectedDate}
  selectedPeriod={selectedPeriod}
  chartData={bloodPressureData.systolics}
  chartData2={bloodPressureData.diastolics}
/>

    </div>
  ) : (
    <p>{selectedDate}에 대한 혈압 데이터가 없습니다.</p>
  );
};

export default BloodPressure;
