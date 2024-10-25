import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getRequest } from '../UrlRequest';
import { useLocation } from 'react-router-dom';

const PatientGrid = ({ patientId }) => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const application = location.state?.application || 'hearton';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('인증 토큰이 없습니다.');
          setLoading(false);
          return;
        }

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;

        // 1. 혈압 데이터 가져오기
        const bloodPressureResponse = await getRequest(application, `/doctor/${patientId}/blood-pressure/record?year=${year}&month=${month}`, token);
        const bloodPressureData = bloodPressureResponse?.recorded_list || [];

        // 2. 체중 데이터 가져오기
        const weightResponse = await getRequest(application, `/doctor/${patientId}/weight/record?year=${year}&month=${month}`, token);
        const weightData = weightResponse?.recorded_list || [];

        // 3. 건강 상태 데이터 가져오기
        const healthConditionResponse = await getRequest(application, `/doctor/${patientId}/health-condition/record?year=${year}&month=${month}`, token);
        const healthConditionData = healthConditionResponse?.recorded_list || [];

        // 각 데이터를 결합하여 rowData 형식으로 변환
        const rowData = Object.keys(bloodPressureData).map((date) => ({
          date,
          systolics: bloodPressureResponse?.systolics[date] || 'N/A',
          diastolics: bloodPressureResponse?.diastolics[date] || 'N/A',
          avg_weights: weightResponse?.avg_weights[date] || 'N/A',
          dry_weights: weightResponse?.dry_weights[date] || 'N/A',
          fainting: healthConditionResponse?.fainting[date] || '없음',
          urine_reduction: healthConditionResponse?.urine_reduction[date] || '없음',
          discomfort: healthConditionResponse?.discomfort[date] || '없음',
          discomfort_symptom: healthConditionResponse?.discomfort_symptom[date] || '',
          edema: healthConditionResponse?.edema[date] || '없음'
        }));

        setRowData(rowData);
        setLoading(false);
      } catch (error) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    if (patientId) {
      fetchData();
    }
  }, [patientId, application]);

  const columnDefs = [
    { headerName: '날짜', field: 'date', sortable: true, filter: true },
    { headerName: '수축기 혈압', field: 'systolics' },
    { headerName: '이완기 혈압', field: 'diastolics' },
    { headerName: '평균 체중', field: 'avg_weights' },
    { headerName: '건조 체중', field: 'dry_weights' },
    { headerName: '실신', field: 'fainting' },
    { headerName: '소변 감소', field: 'urine_reduction' },
    { headerName: '불편감', field: 'discomfort' },
    { headerName: '불편감 증상', field: 'discomfort_symptom' },
    { headerName: '부종', field: 'edema' }
  ];

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
};

export default PatientGrid;
