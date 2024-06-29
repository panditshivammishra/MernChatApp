import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Image,
  Avatar,
  useDisclosure,
  Box
} from "@chakra-ui/react";
import MediaModal from './MediaModal';

export default function OtherProfileModal({ user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageClicked, setImageClicked] = useState(false); // Track image click state
  const [picLoading, setPicLoading] = useState(false);

  const handleAvatarClick = () => {
    onOpen();
    setImageClicked(false); // Reset imageClicked state when modal opens
  };

  return (
    <>
      <Avatar
        onClick={handleAvatarClick}
        h="40px"
        w="40px"
        marginRight="5px"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />

      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px" d="flex">
          <ModalHeader
            fontSize="30px"
         
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            
          >
            <Box boxSize="150px">
            <MediaModal setImageClicked={setImageClicked}>
              <Image
                borderRadius={imageClicked ? '0' : 'full'}
                
                src={user.pic}
                alt={user.name}
                objectFit="cover"
                cursor="pointer"
                onClick={() => setImageClicked(true)} // Update imageClicked state on click
              />
              </MediaModal>
            </Box>
            <Text
              fontSize={{ base: "5vw", md: "26px" }}
            
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
