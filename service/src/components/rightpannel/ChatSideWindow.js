import React from 'react';
import './ChatSideWindow.css'; // 사이드바 스타일링용

const ChatSideWindow = ({ closeChat }) => {
  return (
    <div className="chat-side-window">
      <div className="chat-header">
        <h4>채팅</h4>
        <button onClick={closeChat}>닫기</button>
      </div>
      <div className="chat-content">
        {/* 여기에 채팅 내역을 표시 */}
        <p>채팅 내용이 여기에 표시됩니다.</p>
      </div>
      <div className="chat-input">
        <input type="text" placeholder="메시지를 입력하세요" />
        <button>전송</button>
      </div>
    </div>
  );
};

export default ChatSideWindow;
