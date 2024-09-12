import React from 'react';

const UserInfo = ({ user }) => {
  return (
    <div className="user-info">
      <h1>환자정보</h1>
      <p><strong>이름:</strong> {user.name}</p>
      <p><strong>생년월일:</strong> {user.birthdate}</p>
      <p><strong>키:</strong> {user.height}</p>
      <p><strong>몸무게:</strong> {user.weight}</p>
      <p><strong>병명:</strong> {user.disease}</p>
      <p><strong>기타 사항:</strong> {user.other}</p>
    </div>
  );
};

export default UserInfo;
