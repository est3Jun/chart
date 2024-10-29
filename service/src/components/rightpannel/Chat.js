import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { roomId } = useParams();
  const [ws, setWs] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messageList, setMessageList] = useState([]);
  const messageContainer = useRef(null);

  const scrollToBottom = () => {
    if (messageContainer.current) {
      messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const socket = new WebSocket(`ws://172.30.1.125:8001/ws/?access-token=${token}&chat-room-id=${roomId}`);
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

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const sendMessage = () => {
    if (messageInput !== '' && isOpen) {
      ws.send(JSON.stringify({ content: messageInput }));
      setMessageInput('');
    } else if (!isOpen) {
      alert('서버와 연결이 불안정합니다.');
    }
  };

  return (
    <div className="py-4 bg-white h-full">
      <div className="flex flex-col h-full">
        <div className="message-container px-4" ref={messageContainer}>
          {messageList.map((message, index) => (
            <div
              key={index}
              className={
                message.writer === 'system'
                  ? 'text-center'
                  : message.writer === 'YOUR_USER_NAME'
                  ? 'text-right'
                  : 'text-left'
              }
              data-message-id={message.messageId}
            >
              {index === 0 || messageList[index - 1].writer !== message.writer ? (
                <strong>{message.writer}</strong>
              ) : null}
              <div
                className={`${
                  message.writer === 'system' ? 'center-message' : message.writer === 'YOUR_USER_NAME' ? 'own-message' : 'other-message'
                }`}
                style={{
                  display: message.writer === 'system' ? 'block' : 'flex',
                  flexDirection:
                    message.writer !== 'system' && message.writer !== 'YOUR_USER_NAME'
                      ? 'row'
                      : 'row-reverse',
                  alignItems: 'center',
                }}
              >
                <span>{message.text}</span>
                {message.writer !== 'system' && message.unreadCount !== 0 && (
                  <span className="unread-count">{message.unreadCount}</span>
                )}
              </div>
              {index === messageList.length - 1 ||
              messageList[index + 1].writer !== message.writer ? (
                <span>{message.time}</span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex justify-around items-center mt-auto mb-2">
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
        </div>
      </div>
    </div>
  );
};

export default Chat;
