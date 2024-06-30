import { Button } from "@chakra-ui/button";
import { Box, useColorMode, Badge } from '@chakra-ui/react';
import { Text } from "@chakra-ui/layout";
import { FaSearch } from "react-icons/fa";
import "../components/styles.css";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useState ,useEffect} from "react";
import ProfileModal from "./ProfileModal";
import { getSender } from "../Config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import MyDrawer from "./MyDrawer";

const SideDrawer = () => {
  const { colorMode } = useColorMode();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    setSelectedChat,
    user,
    notification,selectedChat,
    setNotification,
  } = ChatState();

 useEffect(() => {
  if (selectedChat) {
    setNotification(notification.filter((notif) => notif.chat._id !== selectedChat._id));
  }
}, [selectedChat, notification]);


  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        position="relative"
        p="11px 5px 11px 5px"
        backgroundColor={colorMode === "dark" ? "gray.900" : "rgb(30 179 26)"}
        color="#ffff"
        border="none"
      >
        <Box display="flex" alignItems="center" px="15px" w="31%">
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
            <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
              <Button onClick={openDrawer} display="flex" alignItems="center" mx="1px">
                <FaSearch size="1.1rem" />
                <Text display={{ base: "none", md: "flex" }} px={4}>
                  Search User
                </Text>
              </Button>
            </Tooltip>
          </Box>
        </Box>

        <Menu>
          <Tooltip label="Notifications" hasArrow placement="bottom-end">
            <MenuButton>
            <Box position="relative" display="inline-flex" marginRight="40px">
      {/* Bell Icon */}
      <Box
        fontSize="3xl"
        cursor="pointer"
        onClick={() => console.log('Bell clicked')}
        color="#ffff"
        
      >
        <BellIcon size="3xl" />
      </Box>

     
      {notification.length > 0 && (
        <Badge
          colorScheme="red"
          borderRadius="full"
          px="2.5"
          py={1}
          fontSize="0.8em"
          position="absolute"
          top="2"
          right="1"
          transform="translate(50%, -50%)"
        >
          {notification.length}
        </Badge>
      )}
    </Box>
            </MenuButton>
          </Tooltip>
          <MenuList bg={colorMode === "light" ? "rgb(30 179 26)" : "gray.900"} pl={2}>
            {!notification.length && "No New Messages"}
            {notification.map((notif) => (
              <MenuItem
                bg={colorMode === "light" ? "rgb(30 179 26)" : "gray.900"} 
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

        <MyDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
      </Box>
    </>
  );
}

export default SideDrawer;
