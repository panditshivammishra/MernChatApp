import { Box, Stack, Text, Input, InputGroup, InputLeftElement, Avatar, useColorMode } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import LowerNotification from "./LowerNotification";
import { getSenderFull } from "../Config/ChatLogics";
import ChatLoading from "./ChatLoading";
import { ChatState } from "../Context/ChatProvider";
import { FaSearch } from "react-icons/fa";
import Popup from "./Popup";
import "./styles.css";
const apiUrl = import.meta.env.VITE_API_URL;

const MyChats = ({ fetchAgain}) => {
  const { colorMode } = useColorMode();
  const [loggedUser, setLoggedUser] = useState();
  const [searchQuery, setSearchQuery] = useState(""); 
  const [loading, setLoading] = useState(true); 
  const { selectedChat, setSelectedChat, user, chats, setChats, socket,callerData,popup,setPopup } = ChatState();
  const toast = useToast();
   
 
    
  useEffect(() => {
    if (chats) {
      chats.forEach((element) => {
        const userId = getSenderFull(user, element.users)._id;
        socket.emit("registerChat", { from: user._id, to: userId });
      });
      socket.emit("onlineUser", user._id);
    }
  }, [chats]);

  const fetchChats = async () => {
 
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${apiUrl}/api/chat`, config);
      

      setChats(data);


      setLoading(false); 
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false); 
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);


  useEffect(() => {
    socket.on("fetch chat", () => {
      fetchChats();
  })
},[socket])


useEffect(() => {
  const handleRefresh = (chatId) => {
   
    
    if (selectedChat && selectedChat._id === chatId) {
      setSelectedChat(null);
      toast({
        title: "You get removed",
        description: `${getSenderFull(user, selectedChat.users).name} not want to chat with you`,
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    fetchChats();
  };

  socket.on("refresh", handleRefresh);

  
  return () => {
    socket.off("refresh", handleRefresh);
  };
}, [socket, selectedChat, user, fetchChats, getSenderFull]);



  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredChats = chats?.filter((chat) => {
    const chatName = chat.isGroupChat ? chat.chatName : getSenderFull(loggedUser, chat.users).name;
    return chatName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      
      {popup && <Popup data={callerData} popup={popup} setPopup={setPopup} />}
      
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      px={2}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      h="98.5%"
      backgroundColor={colorMode === 'dark' && "gray.700"}
      borderColor={colorMode === "light" ? "rgb(30 179 26)" : "gray.600"}
    >
      {/* Search Input */}
      <InputGroup m={3}>
        <InputLeftElement pointerEvents="none" children={<FaSearch color={colorMode === "light" ? "gray.900" : "gray.300"} size="1.2rem" />} />
        <Input
          py="4px"
          placeholder="Search Chats"
          onChange={handleSearch}
          value={searchQuery}
        />
      </InputGroup>

      <Box
        display="flex"
        flexDir="column"
        bg="#F8F8F8"
        w="100%"
        h="100%"
        marginBottom="5px"
        borderRadius="lg"
        overflowY="hidden"
        backgroundColor={colorMode === 'dark' ? "gray.800" : "#E8E8E8"}
      >
        {loading ? (
          <ChatLoading />
        ) : chats && chats.length > 0 ? (
          <Stack
            overflowY="scroll"
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              '-ms-overflow-style': 'none',
              'scrollbar-width': 'none'
            }}
          >
            {filteredChats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={(selectedChat === chat && colorMode === 'light') ? "rgb(79, 169, 77,0.78)" : `${selectedChat === chat ? "gray.700" : "none"}`}
                px={2}
                py={1}
                m="1"
                borderRadius="10px"
                borderBottom={colorMode === 'light' ? "2px solid rgb(79, 169, 77,0.78)" : "2px solid #2d3748"}
                key={chat._id}
                className={(selectedChat !== chat) && ((colorMode === 'light') ? "myChats" : "darkMychats")}
                display="flex"
                alignItems="center"
                position="relative"
                color={colorMode === 'dark' ? "#ffff" : `${selectedChat === chat ? "#ffff" : "black"}`}
              >
                <Avatar
                  name={chat.isGroupChat ? chat.chatName : getSenderFull(loggedUser, chat.users).name}
                  src={chat.isGroupChat ? "" : getSenderFull(loggedUser, chat.users).pic}
                />
                <Box px={2}>
                  <Text fontWeight="700">
                    {!chat.isGroupChat ? getSenderFull(loggedUser, chat.users).name : chat.chatName}
                  </Text>
                  <Box>
                    {chat.latestMessage && <LowerNotification latestMessage={chat.latestMessage} />}
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text display="inline-flex" alignItems="center" justifyContent="center" py="12px">Add Users To Chat</Text>
        )}
      </Box>
      </Box>
      </>
  );
};

export default MyChats;
