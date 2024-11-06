import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBaseUrl, postRequest, getRequest, baseUrl } from '../UrlRequest';

const Chat = () => {
  const { roomId } = useParams();
  /** const [ws, setWs] = useState(null); */
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [inviteList, setInviteList] = useState([]);
  const [chatRoomName, setChatRoomName] = useState('');
  const [chatRooms, setChatRooms] = useState([]); // 채팅방 목록
  const messageContainer = useRef(null);

  const scrollToBottom = () => {
    if (messageContainer.current) {
      messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    fetchChatRooms(); // 컴포넌트 로드 시 채팅방 목록 가져오기
  }, []);

  const fetchChatRooms = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await getRequest('hearton', '/chat-rooms', token);
      setChatRooms(response.chat_rooms);
    } catch (error) {
      console.error('채팅방 목록 가져오기 에러:', error);
    }
  };

  const sendMessage = () => {
    if (messageInput !== '' /** && isOpen */) {
      /** ws.send(JSON.stringify({ content: messageInput })); */
      setMessageInput('');
    } else if (!isOpen) {
      alert('서버와 연결이 불안정합니다.');
    }
  };

  const createChatRoom = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await postRequest(
        'hearton',
        '/chat-room',
        {
          invite_list: inviteList,
          name: chatRoomName,
        },
        token
      );
      alert('채팅방이 생성되었습니다.');
      setChatRoomName('');
      setInviteList([]);
      fetchChatRooms(); // 채팅방 생성 후 목록 갱신
    } catch (error) {
      console.error('채팅방 생성 에러:', error);
      alert('채팅방 생성에 실패했습니다.');
    }
  };

  return (
    <div className="py-4 bg-white h-full">
      <div className="chat-room-list px-4 mb-4">
        <h2>채팅방 목록</h2>
        {chatRooms.length > 0 ? (
          <ul>
            {chatRooms.map((room) => (
              <li key={room.chat_room_id} className="mb-2">
                <h3>{room.chat_room_name}</h3>
                <p>마지막 메시지: {room.last_message}</p>
                <p>읽지 않은 메시지: {room.unread_count}</p>
                <p>참여자 수: {room.user_count}</p>
                <p>참여자: {room.user_list.join(', ')}</p>
                <p>마지막 메시지 시간: {room.last_message_time}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>채팅방이 없습니다.</p>
        )}
      </div>

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
        </div>
        <div className="chat-room-creation mt-4">
          <input
            type="text"
            placeholder="채팅방 이름"
            value={chatRoomName}
            onChange={(e) => setChatRoomName(e.target.value)}
          />
          <input
            type="text"
            placeholder="초대할 patient ID (쉼표로 구분)"
            value={inviteList.join(',')}
            onChange={(e) =>
              setInviteList(
                e.target.value.split(',').map((id) => parseInt(id.trim()))
              )
            }
          />
          <button onClick={createChatRoom}>채팅방 개설</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
