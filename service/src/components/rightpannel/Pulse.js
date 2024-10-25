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

      try {
        const token = localStorage.getItem('accessToken');
        const response = await getRequest(application, `/doctor/${patientId}/pulse/period?on-date=${selectedDate}&period=${selectedPeriod}`, token);

        if (response && response.heart_rates) {
          setPulseData(response);
        } else {
          setError('해당 기간에 맥박 데이터가 없습니다.');
        }
      } catch (error) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
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
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>맥박</h3>
      <div className="period-buttons">
        {[7, 30, 180, 365].map((period) => (
          <button
            key={period}
            className={selectedPeriod === period ? 'selected-period' : ''}
            onClick={() => handlePeriodChange(period)}
          >
            {`${period}일`}
          </button>
        ))}
      </div>
      <DataChart
        patientId={patientId}
        dataType="pulse"
        endpoint={`/doctor/${patientId}/pulse/period`}
        label="맥박"
        selectedDate={selectedDate}
        selectedPeriod={selectedPeriod}
      />
    </div>
  );
};

export default Pulse;
