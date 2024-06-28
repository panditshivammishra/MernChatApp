import React from 'react'
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  Image,
 Avatar
} from "@chakra-ui/react";

export default function OtherProfileModal({user}) {
     const { isOpen, onOpen, onClose } = useDisclosure();
  return (
      <>
      {/* <IconButton d={{ base: "flex" }} icon={<ViewIcon  />} onClick={onOpen} /> */}
      <Avatar
          onClick={onOpen}
          h="40px"
          w="40px"
          marginRight="5px"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />

  
       <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered >
        <ModalOverlay />
        <ModalContent h="410px" d="flex" >
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
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
            
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
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
  )
}
