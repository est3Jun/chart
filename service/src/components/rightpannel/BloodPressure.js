import React, { useEffect, useState } from 'react';
import { getRequest } from '../UrlRequest';
import DataChart from './DataChart';
import { useLocation } from 'react-router-dom';

const BloodPressure = ({ patientId, selectedDate, selectedPeriod }) => {
  const [bloodPressureData, setBloodPressureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const application = location.state?.application || 'hearton';

  useEffect(() => {
    const fetchBloodPressureData = async () => {
      if (!patientId || !selectedDate) return;

      setLoading(true);
      setError(null);
      setBloodPressureData(null); // 날짜 변경 시 기존 데이터 초기화

      try {
        const token = localStorage.getItem('accessToken');

        // 선택한 날짜의 혈압 데이터를 가져옴
        const dailyResponse = await getRequest(application,
          `/doctor/${patientId}/blood-pressures?on-date=${selectedDate}`,
          token
        );

        // 선택한 기간의 평균 혈압 데이터를 가져옴
        const periodResponse = await getRequest(application,
          `/doctor/${patientId}/blood-pressure/period?on-date=${selectedDate}&period=${selectedPeriod}`,
          token
        );

        // dailyResponse에서 혈압 데이터 확인
        if (dailyResponse && dailyResponse.blood_pressures && dailyResponse.blood_pressures.length > 0) {
          const { systolic, diastolic } = dailyResponse.blood_pressures[0];
          setBloodPressureData({
            systolic: systolic ?? `${selectedDate}에 대한 수축기 혈압 데이터가 없습니다.`,
            diastolic: diastolic ?? `${selectedDate}에 대한 이완기 혈압 데이터가 없습니다.`,
            avg_systolic: periodResponse?.avg_systolic || [],
            avg_diastolic: periodResponse?.avg_diastolic || []
          });
        } else if (periodResponse && (periodResponse.avg_systolic?.length > 0 || periodResponse.avg_diastolic?.length > 0)) {
          // 일별 데이터가 없으나 기간 내 평균 혈압 데이터가 있을 경우
          setBloodPressureData({
            systolic: `${selectedDate}에 대한 수축기 혈압 데이터가 없습니다.`,
            diastolic: `${selectedDate}에 대한 이완기 혈압 데이터가 없습니다.`,
            avg_systolic: periodResponse.avg_systolic,
            avg_diastolic: periodResponse.avg_diastolic
          });
        } else {
          setError(``);
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

  return (
    <div>
      <h3>혈압(mmHg)</h3>
      {bloodPressureData ? (
        <>
          <p>수축기: {bloodPressureData.systolic}</p>
          <p>이완기: {bloodPressureData.diastolic}</p>
        </>
      ) : (
        <p>{selectedDate}에 대한 혈압 데이터가 없습니다.</p>
      )}
      <DataChart
        patientId={patientId}
        dataType="blood-pressure"
        endpoint={`/doctor/${patientId}/blood-pressure/period`}
        label="혈압"
        periodOptions={[]} // 버튼 비활성화
        multipleLines={true}
        selectedDate={selectedDate}
        selectedPeriod={selectedPeriod}
      />
      {error && <p>{error}</p>}
    </div>
  );
};

export default BloodPressure;
