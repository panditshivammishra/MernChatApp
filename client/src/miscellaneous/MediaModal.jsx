import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

export default function MediaModal({ children, setImageClicked }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Handle closing modal and resetting imageClicked state
  const handleClose = () => {
    onClose();
    setImageClicked(false); // Reset imageClicked state to false
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal size="xl" onClose={handleClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent display="flex" p="0" m="0">
          <ModalCloseButton id="icon-button" onClick={handleClose} />
          <ModalBody
            display="flex"
            width="100%"
            height="100%"
            p="0"
            m="0"
          >
            {children}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
