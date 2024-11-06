import React from 'react';
import './ChatRoom.css';

const ChatRoom = ({ isVisible, onClose }) => {
  return (
    <div className={`chatroom-overlay ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="chatroom-content">
        <h2>Chat Room</h2>
        <input
          className="message-input"
          placeholder="메세지를 입력하세요."
        />
        <button>
          <img src="/public/svg/icons/send.svg" alt="send" />
        </button>
        <button onClick={onClose} className="close-button">닫기</button>
      </div>
    </div>
  );
};

export default ChatRoom;

 /** 
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBaseUrl, postRequest, getRequest, baseUrl } from '../UrlRequest';

const ChatRoom=() => {

    const [ws, setWs] = useState(null);


   
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const baseUrl = getBaseUrl('hearton');
    const socket = new WebSocket(`${baseUrl}/ws/${roomId}?access-token=${token}`);
    setWs(socket);

    socket.onopen = () => {
      console.log('웹소켓 연결');
      setIsOpen(true);
    };

    socket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setMessageList((prevMessages) => [...prevMessages, message]);
    };

    socket.onerror = (error) => {
      console.error('웹소켓 에러:', error);
      setIsOpen(false);
    };

    socket.onclose = (event) => {
      console.log('웹소켓 연결 닫힘:', event);
      setIsOpen(false);
    };

    return () => {
      socket.close();
      alert('웹소켓 연결이 해제되었습니다.');
    };
  }, [roomId]);
 

  return ( 
    <div>ChatRoom</div>
  )
}

export default ChatRoom


<input
className="message-input"
value={messageInput}
onChange={(e) => setMessageInput(e.target.value)}
onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
placeholder="메세지를 입력하세요."
/>
<button onClick={sendMessage}>
<img src="/public/svg/icons/send.svg" alt="send" />
</button>

 */