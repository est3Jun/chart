import React, { useState, useEffect } from 'react';
import { getRequest } from '../UrlRequest';
import Chart from './Chart';
import {useLocation} from 'react-router-dom'; //상태로 application 수신받고 url 분리용

const DataChart = ({
  patientId,
  dataType,
  endpoint,
  label,
  periodOptions = [7, 30, 180, 365],
  multipleLines,
  selectedDate,
  selectedPeriod,
}) => {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriodState, setSelectedPeriodState] = useState(periodOptions[0]);
  const location = useLocation();
  const application = location.state?.application || 'hearton'; //기본값은 hearton으로 설정


  const fetchData = async () => {
    if (!patientId || !endpoint) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await getRequest(application,
        `${endpoint}?on-date=${selectedDate}&period=${selectedPeriod}`,
        token
      );

      if (response) {
        setChartLabels(response.dates || []);
        setChartData(response.systolics || response.heart_rates || response.avg_weights || []);
        setChartData2(response.diastolics || []); // 다중 라인 차트에 대한 두 번째 데이터 설정
      } else {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setError(`데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [application, patientId, selectedDate, selectedPeriod]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  // 차트 데이터가 없는 경우에 대한 처리
  if (!chartLabels.length || !chartData.length) {
    return <p>선택한 기간에 대한 데이터가 없습니다.</p>;
  }

  return (
    <div>
      <Chart
        labels={chartLabels}
        data={chartData}
        data2={multipleLines ? chartData2 : null} // 다중 라인 여부에 따라 데이터 설정
        label={label}
        label2={multipleLines ? '이완기' : null}
      />
      <div>
        {periodOptions.map((period) => (
          <button
            key={period}
            className={selectedPeriodState === period ? 'selected-period' : ''}
            onClick={() => setSelectedPeriodState(period)}
          >
            {`${period}일`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataChart;
