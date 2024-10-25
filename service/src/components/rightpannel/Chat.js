import React, { useState } from 'react';
import ChatSideWindow from './ChatSideWindow';

const Chat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      <h3>의사-환자 채팅</h3>
      <button onClick={toggleChat}>채팅 보기</button>
      {isChatOpen && <ChatSideWindow closeChat={toggleChat} />}
    </div>
  );
};

export default Chat;
