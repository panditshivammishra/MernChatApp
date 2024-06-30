import { Box,useColorMode } from "@chakra-ui/react";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import { useState } from "react";
import VideoCall from "./VideoCall";
const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { colorMode } = useColorMode();
  const [videoCall, setVideoCall] = useState(0); // Correct useState
  const { selectedChat } = ChatState();

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
          <SingleChat fetchAgain={fetchAgain} videoCall={videoCall} setVideoCall={setVideoCall} setFetchAgain={setFetchAgain} />
        </Box>
      ) : (<VideoCall setVideoCall={setVideoCall} videoCall={videoCall} setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />)}
    </>
  );
};

export default Chatbox;


