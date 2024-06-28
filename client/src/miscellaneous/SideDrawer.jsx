import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box,useColorMode } from '@chakra-ui/react'
import { Text } from "@chakra-ui/layout";
import { FaSearch } from "react-icons/fa";
import "../components/styles.css"
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { TbLogout2,  } from "react-icons/tb";

import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon, MoonIcon,SunIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../components/ChatLoading"
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../Config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../Context/ChatProvider";
import GroupChatModal from "./GroupChatModal";
import { MdGroupAdd } from "react-icons/md";
const SideDrawer=() =>{
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { colorMode,toggleColorMode } = useColorMode();
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();


  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
   window.location.href = '/';
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);

    } catch (error) {

      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",

      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`http://localhost:5000/api/chat`, { userId }, config);
     
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="11px 5px 11px 5px"
       shadow="rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;"
        backgroundColor={colorMode === "dark" ? "gray.700":"rgb(30 179 26)"}
      
        color="#ffff"
        border="none"
      >
        
        
       <Box display="flex" justifyContent="space-between" alignItems="center" px="15px" w="31%">
         
          <Tooltip label="Profile" hasArrow placement="bottom-end">
    <Box>
      <ProfileModal user={user}>
        <Avatar
          h="40px"
          w="40px"
          marginRight="15px"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />
      </ProfileModal>
    </Box>
  </Tooltip>
          <Box display="flex" alignItems="center">
            

            <Tooltip label="New Group" hasArrow placement="bottom-end">
              <Box display="grid" placeItems="center">
          <GroupChatModal>
          <MdGroupAdd size="1.5rem" />
                </GroupChatModal>
              </Box>
            </Tooltip>
            


   <Tooltip label="change mode" hasArrow placement="bottom-end">
        <button className={colorMode=='light'?"myButtons":"darkButton"} onClick={toggleColorMode}>
          {colorMode === 'light' ? (
            <MoonIcon boxSize="1.5rem" />
          ) : (
            <SunIcon boxSize="1.5rem" />
          )}
        </button></Tooltip>
        <Tooltip label="Logout" hasArrow placement="bottom-end">
        <button className={colorMode=='light'?"myButtons":"darkButton"} style={{ paddingRight: "15px" }} onClick={logoutHandler}>
          <TbLogout2 size="1.5rem" />
        </button></Tooltip>

        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button onClick={onOpen} display="flex" alignItems="center" mx="1px">
            <FaSearch size="1.1rem" />
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
      </Box>
    </Box>

        
        
        <Menu>
          <Tooltip label="Noritications" hasArrow placement="bottom-end">
           
            <MenuButton >
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
                />
               
                  <BellIcon marginBottom="5px" fontSize="3xl" mx={1} />
                  
            </MenuButton></Tooltip>
            <MenuList  bg={colorMode=="light"?"rgb(30 179 26)":"gray.900"} pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}

                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>



      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>


    </>
  );
}

export default SideDrawer;
