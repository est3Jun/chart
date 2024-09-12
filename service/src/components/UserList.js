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
            {user.name}
          </div>
        ))
      ) : (
        <p>해당하는 유저가 없습니다.</p>
      )}
    </div>
  );
};

export default UserList;
