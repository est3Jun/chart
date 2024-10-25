import React, { useState, useEffect } from 'react';
import { getRequest, postRequest, putRequest, deleteRequest } from './UrlRequest'; // UrlRequest.js에서 요청 함수 가져오기
import {useLocation} from 'react-router-dom'; //상태로 application 수신받고 url 분리용
//import './DeviceStatusForm.css'

const DeviceStatusForm = ({ deviceStatusId, patientId, onStatusSubmit, onDeleteDeviceStatus }) => {
  const [formData, setFormData] = useState({
    diagnosis: '',
    surgery_date: '',
    device_type: '',
    insertion_approach: '',
    monitoring_enable: '',
    mri_enable: ''
  });
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태
  const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부 결정
  const [newStatusCreated, setNewStatusCreated] = useState(false); // 새로운 상태 작성 플래그
  const location = useLocation();
  const application = location.state?.application || 'hearton'; //기본값은 hearton으로 설정

  // 환자나 기기 상태가 변경될 때마다 폼을 초기화하고 모드 변경
  useEffect(() => {
    if (patientId) {
      setIsEditMode(!!deviceStatusId); // deviceStatusId가 있으면 수정 모드로 설정
      setNewStatusCreated(false); // 새로운 상태가 생성되지 않도록 초기화

      // 환자가 변경될 때마다 폼 초기화
      if (!deviceStatusId) {
        setFormData({
          diagnosis: '',
          surgery_date: '',
          device_type: '',
          insertion_approach: '',
          monitoring_enable: '',
          mri_enable: ''
        });
      }

      // 수정 모드일 경우, 기존 데이터를 불러오는 함수
      const fetchDeviceStatus = async () => {
        if (deviceStatusId && !newStatusCreated) {
          try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const data = await getRequest(application, `/doctor/device-status/${deviceStatusId}`, token);
            setFormData(data); // 기존 데이터를 폼에 설정
          } catch (error) {
            console.error('Error fetching device status:', error);
            setError('기기 상태 정보를 불러오는 중 오류가 발생했습니다.');
          } finally {
            setLoading(false);
          }
        }
      };

      fetchDeviceStatus();
    }
  }, [application, patientId, deviceStatusId, newStatusCreated]); // 환자가 변경될 때마다 실행

  // 폼 입력 변경 시 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 폼 제출 핸들러 (작성 모드와 수정 모드 구분)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');

      if (!patientId) {
        setError('환자를 선택하지 않았습니다.');
        return;
      }

      if (isEditMode) {
        // 수정 모드일 때 요청
        await putRequest(application, `/doctor/device-status/${deviceStatusId}`, formData, token);
        alert('기기 상태가 성공적으로 수정되었습니다.');
      } else {
        // 기기 상태 작성
        await postRequest(application, `/doctor/${patientId}/device-status`, formData, token);
        alert('기기 상태가 성공적으로 작성되었습니다.');

        setNewStatusCreated(true); // 새로운 상태가 작성됨
        setIsEditMode(true); // 수정 모드로 전환
      }

      // 작성 후 PatientList 갱신을 위해 콜백 호출
      if (onStatusSubmit) {
        onStatusSubmit(patientId || deviceStatusId);
      }
    } catch (error) {
      console.error('Error submitting device status:', error);
      setError(isEditMode ? '기기 상태 수정에 실패했습니다.' : '기기 상태 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 기기 상태 삭제 핸들러
  const handleDelete = async () => {
    if (!isEditMode) return; // 삭제는 수정 모드에서만 가능
    const confirmDelete = window.confirm('정말로 이 기기 상태를 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('accessToken');
      await deleteRequest(application, `/doctor/device-status/${deviceStatusId}`, token);
      alert('기기 상태가 성공적으로 삭제되었습니다.');
      if (onDeleteDeviceStatus) onDeleteDeviceStatus(); // 삭제 후 처리
    } catch (error) {
      console.error('Error deleting device status:', error);
      alert('기기 상태 삭제에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="device-status-form">
      <h2>{isEditMode ? '기기 상태 수정' : '기기 상태 작성'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading}>
            {loading ? '처리 중...' : isEditMode ? '기기 상태 수정' : '기기 상태 작성'}
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              style={{ backgroundColor: 'red', color: 'white' }}
            >
              {loading ? '삭제 중...' : '기기 상태 삭제'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DeviceStatusForm;
