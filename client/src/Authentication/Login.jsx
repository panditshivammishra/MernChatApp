import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useColorMode,
  useToast,
  Text,
  Box
} from "@chakra-ui/react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const Login = ({ handleSignupClick }) => {
  const { colorMode } = useColorMode();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${apiUrl}/api/user/login`,
        { email, password },
        config
      );

      toast({
        title: "Login successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      // Assuming you redirect after successful login
      window.location.href = '/chat';
    } catch (error) {
      toast({
        title: "Error occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const setGuestCredentials = () => {
    setEmail("guest@example.com");
    setPassword("123456");
  };

  return (
    <>
      <VStack spacing="10px">
        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
              placeholder="Enter password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          bg={colorMode === "dark" ? "#2aa2ef" : "#007ccc"}
          color="#ffff"
          width="100%"
          _hover={{
            backgroundColor: "#0062a1"
          }}
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>
        <Button
          _hover={{
            backgroundColor: "#e90404"
          }}
          color="#ffff"
          bg="#e65151"
          variant="solid"
          width="100%"
          onClick={setGuestCredentials}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
      <Box display="grid" placeItems="center">
        <Text
          display="inline-flex"
          fontSize="14px"
          whiteSpace="nowrap"
          p="2px">Or
        </Text>
        <Text
          display="inline-flex"
          fontWeight="700"
          color="#ffff"
          fontSize="16px"
        >
          <b
            style={{ color: "blue", marginRight: "5px", cursor: "pointer" }}
            onClick={handleSignupClick} // Call handleSignupClick to switch tabs
          >
            Sign Up
          </b>
          If not registered
        </Text>
      </Box>
    </>
  );
};

export default Login;
