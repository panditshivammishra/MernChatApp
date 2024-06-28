import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,useColorMode
} from "@chakra-ui/react";
import Signup from "../Authentication/Signup";
import Login from "../Authentication/Login";

function Home() {
  const { colorMode } = useColorMode();
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={colorMode==='dark'?"gray.900":"#ffff"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        shadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" textAlign={[ 'center' ]}>
          Cool-Chat-App
        </Text>
      </Box>
      <Box bg={colorMode==='dark'?"gray.900":"#ffff"} w="100%" p={4} borderRadius="lg" borderWidth="1px" shadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home;

