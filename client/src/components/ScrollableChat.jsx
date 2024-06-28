import { Avatar } from "@chakra-ui/avatar";
import {Box,useColorMode} from "@chakra-ui/react"
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import Media from "./Media";
import {useState,useEffect} from "react"
import "./styles.css"
import BounceLoader from 'react-spinners/BounceLoader';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";

const ScrollableChat = ({ messages,picLoading }) => {
  console.log(messages);
  const {colorMode}=useColorMode()
  const [messageTimes, setMessageTimes] = useState({});
  const { user } = ChatState();
   useEffect(() => {
    // Update time for each message
    const updatedTimes = {};
    messages.forEach((m) => {
      const dateObject = new Date(m.updatedAt);
      const hour = dateObject.getHours();
      const minute = dateObject.getMinutes();
      updatedTimes[m._id] = { hours: hour, minutes: minute };
    });

    setMessageTimes(updatedTimes);
   }, [messages]); // Trigger update when messages change
  
  
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };
  return (
    <ScrollableFeed className="custom-scroll">
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id} className={m.content.length === 0 ? 'ScrollDiv' : ''}>
             
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
              )}
            {/* #BEE3F8  #086f5b  "#054d40" "gray.900" */}
            <Box position="relative" fontWeight="500" color="#ffff" backgroundColor= {
                  m.sender._id === user._id ? `${colorMode==='light'?"rgb(42 252 37 )":"#0b6c5b"}` : `${colorMode==='light'?"#03527f":"gray.900"}`
                } display="flex" justifyContent="center" flexDirection={m.content.length==0&&"column"} alignItems="center" style={{
                
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "18px",
                padding: "4px 12px",
                maxWidth: "60%",
                maxHeight:"60%"
              }}>
           
                
              <p>
          
      { m.content.length > 0 ? (
        m.content
      ) : ( <Media media={m.file} /> )
      }  
    </p>
  
                 <Box className={m.content.length > 0?"content":"media"} >  {messageTimes[m._id] && (
                  <>
                    {formatTime(messageTimes[m._id].hours)}:
                    {formatTime(messageTimes[m._id].minutes)}
                  </>
                )}</Box>
              
            </Box>
          </div>
        ))}
      
     {picLoading&&<BounceLoader color={colorMode==="dark"?"#0b6c5b":"rgb(4 130 1)"}/>}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
