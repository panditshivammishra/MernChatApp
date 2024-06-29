import { FormControl } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import online from "./animations/online.json"
import offline from "./animations/offine.json"
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton,  useToast,useColorMode,Avatar} from "@chakra-ui/react";
import { getSender,getSenderFull } from "../Config/ChatLogics";
import { useEffect,  useState,useRef } from "react";
import axios from "axios";
import Popup from "./Popup"
import OtherProfileModal from "../miscellaneous/OtherProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "./animations/lottie.json"
import { BiImageAdd } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { IoMdVideocam } from 'react-icons/io';
import { Tooltip } from "@chakra-ui/tooltip";
import RiseLoader from 'react-spinners/RiseLoader';
import {DeleteIcon} from '@chakra-ui/icons'
var  selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain, videoCall, setVideoCall }) => {
  const [picLoading, setPicLoading] = useState(false);
  const { colorMode } = useColorMode();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

const previousChatId = useRef(null);
  const [media, setMedia] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const userOnline = {
    loop: true,
    autoplay: true,
    animationData: online,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const userOffline = {
    loop: true,
    autoplay: true,
    animationData: offline,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { popup,setPopup,checkCallChat,setCheckCallChat,selectedChat, setSelectedChat, user, notification, setNotification,socket,setCallRoomId,callerData, setCallerData } =
    ChatState();
  



  
  
 useEffect(() => {
   if (selectedChat && (selectedChat._id === checkCallChat)) {
       socket.emit('leaveRoom', {checkCallChat,to:socket.id});
   
      setCallRoomId(checkCallChat);
      socket.emit("join-room", checkCallChat);
      setVideoCall(true);
      setPopup(false);
    }

    return () => {
       if (selectedChat && (selectedChat._id === checkCallChat)) 
        socket.off('join-room');
    }
  }, [selectedChat,checkCallChat]);
       useEffect(() => {
    
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
   
         socket.on('user-online', (data) => {
           socket.emit('i also online',{userId:data,from:user._id});
         ;
       setOnlineUsers((prevOnlineUsers) => {
      const newOnlineUsers = new Set(prevOnlineUsers);
       newOnlineUsers.add(data);
       return newOnlineUsers;
  });
        });
         
    socket.on('incoming-call', (data) => {
      console.log(`there is call for u from ${data.name}`);
          setCheckCallChat(data.chatId);
          setCallerData(data);
     
      if ((selectedChat == null) || (selectedChat._id != data.chatId)) {
        setPopup(true);
      } 
    });
     
         socket.on("make me online", (data) => {
         
           setOnlineUsers((prevOnlineUsers) => {
             const newOnlineUsers = new Set(prevOnlineUsers);
             newOnlineUsers.add(data);
             return newOnlineUsers;
           });
         });
    socket.on('Do-videoCall', (roomId) => {
      console.log("User room join kro video call ke liye");
      setCallRoomId(roomId);
      setVideoCall(true);
    });
         
         
    socket.on("offline-him", (userId) => {
      setOnlineUsers((prevOnlineUsers) => {
  const newOnlineUsers = new Set(prevOnlineUsers); 
  newOnlineUsers.delete(userId);
  return newOnlineUsers;
});
         })
    return () => {
      // Do not disconnect the socket here

      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.off("incoming-call");
      socket.off("Do-videoCall");
    };
  }, [socket, user,selectedChat]); 
  











  




  const fetchMessages = async () => {   
    if (!selectedChat) return;
      
    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        ` /api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleonpress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      sendMessage();
  }
  }
  


const handleFileSelect = () => {
   
    document.getElementById("fileInput").click();
  };
   




  const postDetails = (file) => {
    setPicLoading(true);
  if (!file) {
    toast({
      title: "Please Select a File!",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4"]; 
  if (!allowedTypes.includes(file.type)) {
    toast({
      title: "Please Select an Image or Video File!",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "shivamapp");
  data.append("cloud_name", "dltghciqz");


fetch("https://api.cloudinary.com/v1_1/dltghciqz/upload", {
  method: "post",
  body: data,
})
  .then((res) => res.json())
  .then((data) => {
    setMedia(data.url.toString());
    

  })
  .catch((err) => {
    setPicLoading(false);
    console.log(err);
  });

  
  };
  
  useEffect(() => {
  if (media) {
    sendMessage();
  }
}, [media]);







 
  const handleVideoCall = () => {
    const anotherUser = getSenderFull(user,selectedChat.users);
    socket.emit('start-call', { name: user.name, chatId: selectedChat._id, callerId: user._id, toRoom: anotherUser._id });
   
  };








  const sendMessage = async () => {
 
    const trimmedMessage = newMessage.trim();
    setNewMessage(trimmedMessage);

  
    if (trimmedMessage.length > 0) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };     

        // Clear the message input field
        setNewMessage("");

        // Use the trimmedMessage for sending
        const { data } = await axios.post(
          " /api/message",
          {
            content: trimmedMessage,
            chatId: selectedChat._id,
          },
          config
        );

      
        socket.emit("new message", data);
        setMessages([...messages, data]);
        
      } catch (error) {
        // Handle any errors
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }

    if (media) {
    
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          " /api/message/upload",
          {
            file: media,
            chatId: selectedChat._id,
          },
          config
        );

      
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setPicLoading(false);
      } catch (error) {
        // Handle any errors
        setPicLoading(false);
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      setMedia("");
    }
    setFetchAgain(!fetchAgain);
  };


  useEffect(() => {
    if (previousChatId.current) {
     
      socket.emit("leave-room", previousChatId.current);
    }
    if (selectedChat) { previousChatId.current = selectedChat._id; }
    else previousChatId.current = null;

    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);


  const deleteChat = async () => {
    
    try {
      
     const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
      };
      
        const { data } = await axios.put(
          " /api/chat/deleteChat",
          {
            chatId: selectedChat._id,
          },
          config
        );
     
      setSelectedChat();
      setFetchAgain(!fetchAgain);
      fetchMessages();
        toast({
          title: "Chat deleted",
          description: "chat deleted Successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: "top",
        });

    } catch {
  toast({
          title: "Error Occurred!",
          description: "Failed to delete the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
     
    }
    
}


  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }    
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;   
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {popup && <Popup data={callerData} popup={ popup} setPopup={setPopup} />}
      {selectedChat ? (
        <>
          
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            py={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
          
           {messages &&
              (!selectedChat.isGroupChat ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                
                 <OtherProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                  
                  
               <Box display="flex" flexDirection="column" alignItems="">
      <Text style={{ fontSize: "17px" ,minHeight:"0" ,fontWeight:"650"}}>
        {getSender(user, selectedChat.users)}
      </Text>
      <Box display="inline-flex"  alignItems="center" >
        {onlineUsers.has(getSenderFull(user, selectedChat.users)._id) ? (
          <>
            <Text style={{ fontSize: "12px", color: "rgb(73,193,83)"  , minHeight:"0" }}>online</Text>
            <Box width="15px" height="15px">
              <Lottie options={userOnline} width="100%" height="100%" />
            </Box>
          </>
        ) : (
          <>
            <Text style={{ fontSize: "12px", color: "rgb(255, 60, 0)" , minHeight:"0"  }}>offline</Text>
            <Box width="15px" height="15px">
              <Lottie options={userOffline} width="100%" height="100%" />
            </Box>
          </>
        )}
      </Box>
    </Box>
                 
                </Box>
              ) : (
                <>
                  <Box display="flex">
                  <Avatar  name={selectedChat.chatName }
                      src={ "" }    h="40px"
          w="40px"/>
                    <Text fontSize="17px" display="inline-flex" p="4px" fontWeight="700">{selectedChat.chatName}</Text>
                    </Box>
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
            {!selectedChat.isGroupChat && (
              <Box display="flex" alignItems="center" justifyContent="center">
                <Tooltip label="delete chat" hasArrow placement="bottom-end">
                  <button  onClick={deleteChat} style={{marginRight:"15px",marginBottom:"2px"}}>
                    <DeleteIcon boxSize="1.2rem" color={colorMode === "light" ? "rgb(30 179 26)" : "#ffff"} />
                    </button>
                </Tooltip>
                <Tooltip label="video call" hasArrow placement="bottom-end">
              
     
                  <button
                    onClick={() => handleVideoCall()}
                  >
                    <IoMdVideocam color={colorMode === "light" ? "rgb(30 179 26)" : "#ffff"} size="1.5rem"/>
                  </button>
                </Tooltip>
              </Box>
            )
            }
            


          </Text>
        
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
             bg={colorMode==='dark'?"gray.800":"#E8E8E8"}
            w="100%"
            h="100%"
           
            overflowY="hidden"
            position="relative"
          >
            {loading ? (
             <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          w="100%"
                h="100%"
              
        >
          <RiseLoader size={10} color={colorMode=="light"?"#4FA94D":"#ffff"} />
        </Box>
            ) : (
              
                <Box className="messages" position="relative">
                 
                  <ScrollableChat messages={messages} picLoading={ picLoading } />
              </Box>
            )}

            <FormControl
              onKeyDown={handleonpress}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div >
                  <Lottie
                    options={defaultOptions}
                    height={50}
                
                    width={50}
                    style={{ marginBottom: 2, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
               <InputGroup>
              <Input
                variant="filled"
                  bg={colorMode==="dark"?"gray.700":"#E0E0E0"}
                
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                />      
              
                


      <InputRightElement onClick={handleFileSelect} cursor="pointer"  marginRight="9">
        <BiImageAdd   color={colorMode==="light"?"rgb(30 179 26)":"#ffff"}  size="20px"/>
      
        <input
          id="fileInput"
          type="file"
          accept="*/*"
          style={{ display: "none" }}
           onChange={(e) => postDetails(e.target.files[0])}
        />
      </InputRightElement>







         <InputRightElement onClick={sendMessage} cursor="pointer">
   
    <IoSend   color={colorMode==="light"?"rgb(30 179 26)":"#ffff"} size="20px"/>

                  
      </InputRightElement>
              </InputGroup>
             
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%" w="100%" bg={colorMode=="light"?"green":"gray.700"} borderBottomRadius="6px">
          <Text fontSize="3xl" color="#ffff" fontWeight="800" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;