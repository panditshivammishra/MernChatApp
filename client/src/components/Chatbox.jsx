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
          p={3}
          bg={colorMode==='light'?"#ffff":"gray.700"}
          w={{ base: "100%", md: "68%" }}
          borderRadius="lg"
          boxShadow="rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset"
          borderWidth="2px"
          borderColor={colorMode === "light" ? "rgb(30 179 26)" : "gray.600"}
           h="98.5%"
        >
          <SingleChat fetchAgain={fetchAgain} videoCall={videoCall} setVideoCall={setVideoCall} setFetchAgain={setFetchAgain} />
        </Box>
      ):(<VideoCall setVideoCall={setVideoCall} videoCall={videoCall}/>)}
    </>
  );
};

export default Chatbox;


