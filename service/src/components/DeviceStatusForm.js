import React, { useState, useEffect } from 'react';
import { getRequest, postRequest, putRequest } from './UrlRequest';
import { useLocation } from 'react-router-dom';

const DeviceStatusForm = ({ patientId, isListView }) => {
  const [formData, setFormData] = useState({
    diagnosis: '',
    surgery_date: '',
    device_type: '',
    insertion_approach: '',
    monitoring_enable: '',
    mri_enable: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deviceStatusList, setDeviceStatusList] = useState([]);
  const [editStatusId, setEditStatusId] = useState(null); // 수정할 기기 상태 ID 저장
  const location = useLocation();
  const application = location.state?.application || 'hearton';

  // 기기 상태 리스트 가져오기
  const fetchDeviceStatusList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const data = await getRequest(application, `/doctor/${patientId}/device-statuses`, token);
      const formattedList = data.device_statuses.map((item) => {
        const endDate = item.interval.end_date === '현재' ? new Date().toISOString().slice(0, 10) : item.interval.end_date;
        return {
          id: item.device_status.device_status_id,
          startDate: item.interval.start_date,
          endDate: endDate,
          diagnosis: item.device_status.diagnosis,
          deviceType: item.device_status.device_type,
          insertionApproach: item.device_status.insertion_approach
        };
      });
      setDeviceStatusList(formattedList);
    } catch (error) {
      console.error('Error fetching device statuses:', error);
      setError('기기 상태 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (patientId) {
      fetchDeviceStatusList();
    }
  }, [patientId]);

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 수정 버튼 클릭 시 수정 모드로 전환하고 폼 데이터 설정
  const handleEditClick = (status) => {
    setEditStatusId(status.id);
    setFormData({
      diagnosis: status.diagnosis,
      surgery_date: status.startDate,
      device_type: status.deviceType,
      insertion_approach: status.insertionApproach,
      monitoring_enable: '',
      mri_enable: ''
    });
  };

  // 수정 폼 제출
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      await putRequest(application, `/doctor/device-status/${editStatusId}`, formData, token);
      alert('기기 상태가 성공적으로 수정되었습니다.');
      setEditStatusId(null); // 수정 모드 종료
      fetchDeviceStatusList(); // 목록 갱신
    } catch (error) {
      console.error('Error updating device status:', error);
      setError('기기 상태 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 작성 폼 제출
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      await postRequest(application, `/doctor/${patientId}/device-status`, formData, token);
      alert('기기 상태가 성공적으로 작성되었습니다.');
      setFormData({
        diagnosis: '',
        surgery_date: '',
        device_type: '',
        insertion_approach: '',
        monitoring_enable: '',
        mri_enable: ''
      });
      fetchDeviceStatusList(); // 목록 갱신
    } catch (error) {
      console.error('Error creating device status:', error);
      setError('기기 상태 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="device-status-container">
      {isListView ? (
        <div className="device-status-list">
          <h2>기기 상태 목록</h2>
          {loading ? (
            <p>로딩 중...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <ul>
              {deviceStatusList.map((status) => (
                <div key={status.id} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                  <div>
                    <h4>{status.diagnosis}</h4>
                    <p>시작일: {status.startDate}</p>
                    <p>종료일: {status.endDate}</p>
                    <p>기기 유형: {status.deviceType}</p>
                    <p>삽입 접근 방식: {status.insertionApproach}</p>
                    <button onClick={() => handleEditClick(status)}>수정</button>
                  </div>

                  {editStatusId === status.id && (
                    <form onSubmit={handleEditSubmit} className="edit-device-status-form" style={{ marginTop: '10px' }}>
                      <div>
                        <label>진단명:</label>
                        <input
                          type="text"
                          name="diagnosis"
                          value={formData.diagnosis}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label>수술일:</label>
                        <input
                          type="date"
                          name="surgery_date"
                          value={formData.surgery_date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label>기기 유형:</label>
                        <select
                          name="device_type"
                          value={formData.device_type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">선택</option>
                          <option value="심박기(Pacemaker)">심박기(Pacemaker)</option>
                          <option value="삽입형제세동기(ICD)">삽입형제세동기(ICD)</option>
                          <option value="심장재동기화치료기(CRT-D)">심장재동기화치료기(CRT-D)</option>
                          <option value="심장재동기화치료기(CRT-P)">심장재동기화치료기(CRT-P)</option>
                        </select>
                      </div>
                      <div>
                        <label>삽입 접근 방식:</label>
                        <select
                          name="insertion_approach"
                          value={formData.insertion_approach}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">선택</option>
                          <option value="개흉">개흉</option>
                          <option value="경정맥">경정맥</option>
                          <option value="피하">피하</option>
                        </select>
                      </div>
                      <button type="submit" disabled={loading}>
                        {loading ? '처리 중...' : '기기 상태 수정'}
                      </button>
                    </form>
                  )}
                </div>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="device-status-form">
          <h2>기기 상태 작성</h2>
          <form onSubmit={handleCreateSubmit}>
            <div>
              <label>진단명:</label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>수술일:</label>
              <input
                type="date"
                name="surgery_date"
                value={formData.surgery_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>기기 유형:</label>
              <select
                name="device_type"
                value={formData.device_type}
                onChange={handleInputChange}
                required
              >
                <option value="">선택</option>
                <option value="심박기(Pacemaker)">심박기(Pacemaker)</option>
                <option value="삽입형제세동기(ICD)">삽입형제세동기(ICD)</option>
                <option value="심장재동기화치료기(CRT-D)">심장재동기화치료기(CRT-D)</option>
                <option value="심장재동기화치료기(CRT-P)">심장재동기화치료기(CRT-P)</option>
              </select>
            </div>
            <div>
              <label>삽입 접근 방식:</label>
              <select
                name="insertion_approach"
                value={formData.insertion_approach}
                onChange={handleInputChange}
                required
              >
                <option value="">선택</option>
                <option value="개흉">개흉</option>
                <option value="경정맥">경정맥</option>
                <option value="피하">피하</option>
              </select>
            </div>
            <div>
              <label>모니터링 가능 여부:</label>
              <select
                name="monitoring_enable"
                value={formData.monitoring_enable}
                onChange={handleInputChange}
                required
              >
                <option value="">선택</option>
                <option value="유">유</option>
                <option value="무">무</option>
              </select>
            </div>
            <div>
              <label>MRI 가능 여부:</label>
              <select
                name="mri_enable"
                value={formData.mri_enable}
                onChange={handleInputChange}
                required
              >
                <option value="">선택</option>
                <option value="유">유</option>
                <option value="무">무</option>
              </select>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? '처리 중...' : '기기 상태 작성'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DeviceStatusForm;
