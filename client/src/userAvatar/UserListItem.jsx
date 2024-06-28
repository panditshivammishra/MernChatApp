import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { useColorMode } from "@chakra-ui/react";

const UserListItem = ({ handleFunction,user }) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
   
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color={colorMode=="light"?"black":"#ffff"}
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      bg={colorMode=="light"?"#E8E8E8":"gray.900"}
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;