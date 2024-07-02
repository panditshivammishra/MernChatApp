import {React,useState,useEffect} from 'react'
import { Text } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";
import { FaCamera } from "react-icons/fa";

export default function lowerNotification({ latestMessage }) {
const [messageTimes, setMessageTimes] = useState({});

  useEffect(() => {
    const timeObject = {};
    if (latestMessage) {
      const dateObject = new Date(latestMessage.updatedAt);
      const hour = dateObject.getHours();
      const minute = dateObject.getMinutes();
     
      timeObject.hour = hour;
      timeObject.minute = minute;
     
       setMessageTimes(timeObject);
    }
   }, [latestMessage]); 
  
  
  
  return (
  <Box display="flex">
      <Text fontSize="xs" color="grey" fontWeight="300">
          {latestMessage.content.length>0?(<>
             
              {latestMessage.content.length > 50
                  ? latestMessage.content.substring(0, 40) + "..."
                  : latestMessage.content}</>):( <FaCamera/>)}
      </Text>
        <Box position="absolute" fontSize="xs" right="3" top="2.5" color="grey" fontWeight="500"> {`${messageTimes&&(messageTimes.hour<10?`0${messageTimes.hour}`:messageTimes.hour)}:${messageTimes&&(messageTimes.minute<10?`0${messageTimes.minute}`:messageTimes.minute)}`}</Box>
    </Box>
  )
}
