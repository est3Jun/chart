import React from 'react';

const UserList = ({ users, setSelectedUser }) => {
  return (
    <div className="user-list">
      {users.length > 0 ? (
        users.map((user) => (
          <div
            key={user.id}
            className="user-item"
            onClick={() => setSelectedUser(user)} // 유저 클릭 시 선택
          >
            <div className="user-item-header">
              <span className="user-name">{user.name}</span>
              <span className="user-birthdate">({user.birthdate})</span>
            </div>
            <div className="user-item-other">{user.other}</div>
          </div>
        ))
      ) : (
        <p>해당하는 유저가 없습니다.</p>
      )}
    </div>
  );
};

export default UserList;
