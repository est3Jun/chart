// PatientGrid.js
import React, { useEffect, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getRequest } from '../UrlRequest';
import { useLocation } from 'react-router-dom';

const PatientGrid = ({ patientId, setSelectedDate }) => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize] = useState(15);
  const location = useLocation();
  const application = location.state?.application || 'hearton';
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    setRowData([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
  }, [patientId]);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore || (initialLoad && page > 1)) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const data = await getRequest(application, `/doctor/health/${patientId}?page=${page}&size=${pageSize}`, token);

      const healthList = data.health_list || [];
      const formattedData = healthList.map((record) => ({
        on_date: record.on_date,
        systolic: record.blood_pressure?.systolic || '미등록',
        diastolic: record.blood_pressure?.diastolic || '미등록',
        weight: record.weight || '미등록',
        heart_rate: record.heart_rate !== null ? record.heart_rate : '미등록',
        fainting: record.health_condition?.fainting || '미등록',
        urine_reduction: record.health_condition?.urine_reduction || '미등록',
        discomfort: record.health_condition?.discomfort || '미등록',
        discomfort_symptom: record.health_condition?.discomfort_symptom || '미등록',
        edema: record.health_condition?.edema || '미등록',
      }));

      setRowData((prevData) => [...prevData, ...formattedData]);
      setHasMore(healthList.length === pageSize);
      setPage((prevPage) => prevPage + 1);
      setInitialLoad(false);
    } catch (error) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [application, page, pageSize, patientId, loading, hasMore, initialLoad]);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollHeight - scrollTop === clientHeight) {
      fetchData();
    }
  };

  useEffect(() => {
    if (initialLoad) {
      fetchData();
    }
  }, [fetchData, initialLoad]);

  const columnDefs = [
    { headerName: '날짜', field: 'on_date', sortable: true, filter: true, flex: 1, minWidth: 100 },
    { headerName: '수축기 혈압', field: 'systolic', flex: 1, minWidth: 100 },
    { headerName: '이완기 혈압', field: 'diastolic', flex: 1, minWidth: 100 },
    { headerName: '체중', field: 'weight', flex: 1, minWidth: 100 },
    { headerName: '심박수', field: 'heart_rate', flex: 1, minWidth: 100 },
    { headerName: '실신', field: 'fainting', flex: 1, minWidth: 100 },
    { headerName: '소변 감소', field: 'urine_reduction', flex: 1, minWidth: 100 },
    { headerName: '불편감', field: 'discomfort', flex: 1, minWidth: 100 },
    { headerName: '불편감 증상', field: 'discomfort_symptom', flex: 1, minWidth: 100 },
    { headerName: '부종', field: 'edema', flex: 1, minWidth: 100 }
  ];

  const handleRowClick = (event) => {
    const date = event.data.on_date;
    setSelectedDate(date);
  };

  return (
    <div
      className="patientgrid-content ag-theme-alpine" // 기본 테마 클래스 추가
      onScroll={handleScroll}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={false}
        onCellClicked={handleRowClick}
        domLayout="autoHeight"
      />
      {loading && <p>로딩 중...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default PatientGrid;
