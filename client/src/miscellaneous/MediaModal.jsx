import React from 'react'
import "../components/styles.css"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
export default function MediaModal({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal size="xl" onClose={onClose} isOpen={isOpen} isCentered >
                <ModalOverlay />
                <ModalContent display="flex" p="0" m="0" >
                    <ModalCloseButton id="icon-button"/>
                    <ModalBody
                        display="flex"
                        // flexDir="column"
                        // alignItems="center"
                        width="100%"
                        height="100%"
                         p="0" m="0"
                    >   
                        {children}
                    </ModalBody>
                   
                </ModalContent>
            </Modal>
        </>
    );
}
