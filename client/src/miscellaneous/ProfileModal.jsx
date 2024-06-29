import {  useRef, useState,useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from "axios";
import MediaModal from './MediaModal';
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
  IconButton,
  Text,
  Image,
  Box,Spinner
} from "@chakra-ui/react";
import {useToast} from "@chakra-ui/toast"
import { FaCamera } from "react-icons/fa";






const ProfileModal = ({ children }) => {
  const [imageUrl, setImageUrl] = useState();
  const [cloneUser,setCloneUser] = useState(null);
  const { user, setUser } = ChatState();
   const toast = useToast();
  const [picLoading, setPicLoading] = useState();
  const [updatedPic, setUpdatedPic] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef();
const handleButtonClick = () => {
    fileInputRef.current.click();
  };
   
  if (cloneUser == null) setCloneUser(user);
  
const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
   
 
  
  
  if (pics.type === "image/jpeg" || pics.type === "image/png") {
    const imageSrc = URL.createObjectURL(pics);
    setImageUrl(imageSrc);
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "shivamapp");
      data.append("cloud_name", "dltghciqz");
      fetch("https://api.cloudinary.com/v1_1/dltghciqz/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUpdatedPic(data.url.toString());
          console.log(data.url.toString());
          
        })
        .catch((err) => {
          console.log(err);
          
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
     
      return;
    }
  };

  const upadteTheProfilePic = async() => {
    if (!updatedPic) return;
    console.log(updatedPic);

    try {
       const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
      };
      
       const response = await axios.put(
      " /api/chat/updatePic",
      { updatedPic },
      config
    );
      
      const updatedUser = response.data;
       localStorage.setItem("userInfo", JSON.stringify(updatedUser));
   
       setPicLoading(false);
      setUser(updatedUser);
    
    }
    catch {
      setPicLoading(false);
     toast({
          title: "Error Occurred!",
          description: "Failed to update the profile pic",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
    }
  }
    
  
  useEffect(() => {
    
    upadteTheProfilePic();
},[updatedPic])

  useEffect(() => {
  
    if ((cloneUser!=user)) {
      setCloneUser(user);
    }
  }, [user]);
  
  return (
    <>
     
        <Box  display='inline-block' onClick={onOpen}>{children}</Box>
     
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
            <Box position="relative" display="inline-block" boxSize="150px">
      {(picLoading || cloneUser!=user) && (
        <Spinner
          position="absolute"
          top="40%"
          left="40%"
          transform="translate(-50%, -50%)"
          size="lg"
          color="white"
        />
              )}
              <MediaModal>
      <Image
        borderRadius="full"
                  width="100%"
                  padding="1"
                height="100%"
                cursor="pointer"
        src={imageUrl?imageUrl:user.pic}
        alt={user.name}
        objectFit="cover"
      /></MediaModal>
      <Button
        position="absolute"
        bottom="0"
        right="3"
        borderRadius="full"
        p="1"
        onClick={handleButtonClick}
      >
        <FaCamera />
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => postDetails(e.target.files[0])}
      />
    </Box>
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
  );
};

export default ProfileModal;