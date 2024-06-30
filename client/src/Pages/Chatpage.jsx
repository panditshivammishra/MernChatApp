import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import ChatControl from "../miscellaneous/ChatControl";
const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  return (
    <Box display="flex" position="relative" w="100%" h="100vh" overflowY="hidden">
      
      {user&&<ChatControl/>}

    <Box display="flex" position="relative" flexDirection="column" style={{ width: "95%" }}  >
     
        {user &&<SideDrawer />}

      <Box display="flex" justifyContent="space-between" w="100%" h="92vh" position="relative">
        
       
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
           {user && <MyChats fetchAgain={fetchAgain} />}
      </Box>
    </Box></Box>
  );
};

export default Chatpage;
