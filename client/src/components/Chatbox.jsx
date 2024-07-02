import { Box,useColorMode } from "@chakra-ui/react";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import { useState } from "react";
import VideoCall from "./VideoCall";
const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { colorMode } = useColorMode();
  
  const { selectedChat,videoCall } = ChatState();

  return (
    <>
      {!videoCall ? (
        <Box
          display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
          alignItems="center"
          flexDir="column"
        
          bg={colorMode==='light'?"#ffff":"gray.700"}
          w={{ base: "100%", md: "68%" }}
         
          border="none"
          
          h="98.5%"
         
        >
          <SingleChat fetchAgain={fetchAgain}  setFetchAgain={setFetchAgain} />
        </Box>
      ) : (<VideoCall setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />)}
    </>
  );
};

export default Chatbox;


