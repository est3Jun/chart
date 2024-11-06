import React, { useState } from 'react';
import Modal from 'react-modal';
import { postRequest, loginRequest } from './UrlRequest'; // loginRequest 추가
import './Modal.css';

const SignupModal = ({ isOpen, onRequestClose }) => {
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [application] = useState('hearton'); // 기본값 설정

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  // 문자 인증 코드 전송
  const sendSmsCode = async () => {
    try {
      await loginRequest('/api/v1/sms', { phone, application: 'hearton' });
      setIsCodeSent(true);
      alert('인증 코드가 전송되었습니다.');
    } catch (error) {
      console.error('SMS 전송 오류:', error);
      alert('문자 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 문자 인증 코드 확인
  const verifySmsCode = async () => {
    try {
      await loginRequest('/api/v1/sms/verification', { code, phone });
      alert('인증 성공');
      handleSignup(); // 인증 성공 시 회원가입 요청 진행
    } catch (error) {
      console.error('SMS 인증 오류:', error);
      alert('인증에 실패했습니다. 올바른 코드를 입력했는지 확인하세요.');
    }
  };

  // 회원가입 핸들러
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const url = `/doctor/sign-up`;
      await postRequest(application, url, {
        account,
        password,
        name,
        nickname,
        birthdate,
        phone,
      });
      alert('회원가입에 성공했습니다.');
      onRequestClose();
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      contentLabel="Signup Modal"
    >
      <h2>회원가입</h2>
      <form>
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button type="button" onClick={nextStep}>다음</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            <input
              type="date"
              placeholder="Birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button type="button" onClick={prevStep}>이전</button>
            <button type="button" onClick={nextStep}>다음</button>
          </>
        )}

        {step === 3 && (
          <>
            <button type="button" onClick={sendSmsCode} disabled={isCodeSent}>
              {isCodeSent ? '코드 다시 보내기' : '인증 코드 보내기'}
            </button>
            {isCodeSent && (
              <>
                <input
                  type="text"
                  placeholder="인증 코드 입력"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                <button type="button" onClick={verifySmsCode}>인증하기</button>
              </>
            )}
            <button type="button" onClick={prevStep}>이전</button>
          </>
        )}
      </form>
      <button onClick={onRequestClose}>닫기</button>
    </Modal>
  );
};

export default SignupModal;
