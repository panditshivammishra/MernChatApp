import React, { useState } from 'react';
import { Box, Button, Tooltip, useColorMode } from '@chakra-ui/react';
import GroupChatModal from './GroupChatModal';
import { MdGroupAdd } from 'react-icons/md';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaUser } from 'react-icons/fa';
import { HiUserAdd } from 'react-icons/hi';
import { TbLogout2 } from "react-icons/tb";
import MyDrawer from './MyDrawer';
import { ChatState } from '../Context/ChatProvider';

export default function ChatControl() {
  const { setSelectedChat, videoCall } = ChatState();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleSelect = () => {
    setSelectedChat('');
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };

  return (
    <>
      <Box
        display="flex"
        minWidth="0"
        width={videoCall ? "0%" : "60px"}
        position="relative"
        justifyContent="space-around"
        flexDirection="column"
        mx={videoCall ? "0" : "5px"}
        transition="width .5s ease, margin .5s ease"
        overflow="hidden"
      >
        <Tooltip label="Add User" placement="bottom-end">
          <Button
            onClick={openDrawer}
            color={colorMode === "light" ? "rgb(30 179 26)" : "#ffff"}
          >
            <HiUserAdd size="1.8rem" />
          </Button>
        </Tooltip>
        <Tooltip label="New Group" hasArrow placement="bottom-end">
          <GroupChatModal>
            <MdGroupAdd size="1.55rem" />
          </GroupChatModal>
        </Tooltip>
        <Tooltip label="Change Mode" hasArrow placement="bottom-end">
          <Button
            p="2px"
            onClick={toggleColorMode}
            color={colorMode === "light" ? "rgb(30 179 26)" : "#ffff"}
          >
            {colorMode === 'light' ? <MoonIcon boxSize="1.2rem" /> : <SunIcon boxSize="1.3rem" />}
          </Button>
        </Tooltip>
        <Tooltip label="Select None" placement="bottom-end">
          <Button
            onClick={handleSelect}
            color={colorMode === "light" ? "rgb(30 179 26)" : "#ffff"}
          >
            <FaUser size="1.25rem"/>
          </Button>
        </Tooltip>
        <Tooltip label="Logout" hasArrow placement="bottom-end">
          <Button
            onClick={logoutHandler}
            color={colorMode === "light" ? "rgb(30 179 26)" : "#ffff"}
          >
            <TbLogout2 size="1.56rem" />
          </Button>
        </Tooltip>
      </Box>

      <MyDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
}
