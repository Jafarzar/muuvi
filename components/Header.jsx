import { HamburgerIcon, SearchIcon, StarIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
} from "@chakra-ui/react";

const Header = () => {
  return (
    <HStack
      justify="space-between"
      w="full"
      color="white"
      py={4}
      px={[6, 6, 24]}
      zIndex="10"
      position="fixed"
      gap={6}
      bgGradient="linear(to-b, black, transparent)"
    >
      <HStack alignItems="center">
        <StarIcon color="orange" w={6} h={6} />
        <Heading size="lg">Muuvi</Heading>
      </HStack>
      <InputGroup maxW={450} w="full" display={["none", "none", "block"]}>
        <Input
          type="search"
          placeholder="What do you want to watch?"
          _placeholder={{ opacity: 1, color: "white" }}
          _focus={{ color: "white", borderColor: "white" }}
          _active={{ color: "white", borderColor: "white" }}
        />
        <InputRightElement w={10}>
          <Button
            h="full"
            size="sm"
            bg="transparent"
            _hover={{ color: "white" }}
            _active={{ color: "white" }}
          >
            <SearchIcon />
          </Button>
        </InputRightElement>
      </InputGroup>

      <HamburgerIcon w={6} h={6} />
    </HStack>
  );
};

export default Header;
