import React, { useRef } from 'react';
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode
} from "@chakra-ui/react";
import Signup from "../Authentication/Signup";
import Login from "../Authentication/Login";

function Home() {
  const { colorMode } = useColorMode();
  const signupRef = useRef(null); 

  const handleSignupClick = () => {
    console.log("I am in signup")
    
   signupRef.current.click();
  };

  return (
    <Container maxW="xl" centerContent marginTop={{ base: "40", lg: "10px" }}>
      <Box
        d="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={3}
        bg={colorMode === 'dark' ? "gray.900" : "#87CEEB"}
        w="100%"
        m="10px 0 15px 0" 
        borderRadius="lg"
        borderWidth="1px"
        shadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
      >
        <Text
          fontSize="4xl"
          bgGradient="linear(to-r, #2E3A75, #357C6A, #8F8F70)"
          bgClip="text"
          fontWeight="bold"
          textAlign={['center']}
        >
          Chat-App
        </Text>
      </Box>
      <Box
        bg={colorMode === 'dark' ? "gray.900" : "#75cff5"}
        w="100%"
        p={2}
        borderRadius="lg"
        borderWidth="1px"
        shadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
        color={colorMode === "light" ? "gray.900" : "#ffff"}
      >
        <Tabs isFitted variant="soft-rounded" paddingTop="1">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab ref={signupRef}>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login handleSignupClick={handleSignupClick} />
            </TabPanel>
            <TabPanel
              overflow="auto" // Allow scrolling within the container
              overscrollBehavior="none" // Prevents scroll chaining
              maxHeight="60vh" // Limit the height to 70% of the viewport height
              className='logs'
            >
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home;
