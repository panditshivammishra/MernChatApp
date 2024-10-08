import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
const apiUrl = import.meta.env.VITE_API_URL;
const ChatContext = createContext();

const ChatProvider = ({ children }) => {

  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [popup, setPopup] = useState(false);
  const [callRoomId, setCallRoomId] = useState();
  const [checkCallChat, setCheckCallChat] = useState();
  const [callerData, setCallerData] = useState();
  const [videoCall, setVideoCall] = useState(false);
  const ENDPOINT = `${apiUrl}`;
  
  const socket = useMemo(() => io(ENDPOINT), []);
  

  useEffect(() => {
 const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, []);
  

  useEffect(() => {
  if (user) { // Check if user is defined before using it
    socket.emit("setup", user._id);
    }
    
    return () => {
      socket.off("setup");
    }
}, [user]);
  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,socket,popup,setPopup,checkCallChat, setCheckCallChat,callRoomId, setCallRoomId,callerData, setCallerData
      ,videoCall, setVideoCall}}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
