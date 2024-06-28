import { Box, Stack, Text, Input } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import LowerNotification from "./LowerNotification";
import { getSenderFull } from "../Config/ChatLogics";
import ChatLoading from "./ChatLoading";
import {  Avatar, useColorMode,InputGroup,InputLeftElement } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { SearchIcon } from "@chakra-ui/icons";
import "./styles.css";

const MyChats = ({ fetchAgain }) => {
  const { colorMode } = useColorMode();
  const [loggedUser, setLoggedUser] = useState();
  const [isMapping, setIsMapping] = useState(true);
  const { selectedChat, setSelectedChat, user, chats, setChats, socket } = ChatState();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

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

  useEffect(() => {
    if (chats) {
      setIsMapping(true); // Set loading state to true before mapping
      // Simulate a delay for the mapping process (replace with actual mapping logic)
      setTimeout(() => {
        setIsMapping(false); // Set loading state to false once mapping is complete
      }, 1000); // Adjust the delay as needed
    }
  }, [chats]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:5000/api/chat", config);

      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredChats = chats?.filter((chat) => {

    const chatName = chat.isGroupChat ? chat.chatName : getSenderFull(loggedUser, chat.users).name;
   
    return chatName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      px={2}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      h="98.5%"
      backgroundColor={colorMode === 'dark' && "gray.700"}
      borderColor={colorMode === "light" ? "rgb(30 179 26)" : "gray.600"}
      borderWidth="2px"
      boxShadow="rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset"
    >
     

      {/* Search Input */}
    <InputGroup m={3} >
  <InputLeftElement pointerEvents="none" children={<SearchIcon  color={colorMode==="light"?"gray.500":"gray.300"} />} />
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
        mb="3"
        borderRadius="lg"
        overflowY="hidden"
        backgroundColor={colorMode === 'dark' ? "gray.800" : "#E8E8E8"}
      >
        {chats && !isMapping ? (
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
                {console.log(chat)}
                <Avatar  name={chat.isGroupChat ? chat.chatName : getSenderFull(loggedUser, chat.users).name}
        src={chat.isGroupChat ? "" : getSenderFull(loggedUser, chat.users).pic} />
                <Box px={2}>
                  <Text fontWeight="700">
                    {!chat.isGroupChat
                      ? getSenderFull(loggedUser, chat.users).name
                      : chat.chatName}
                  </Text>
                  <Box>
                    {(chat.latestMessage) && (<LowerNotification latestMessage={chat.latestMessage} />)}
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
