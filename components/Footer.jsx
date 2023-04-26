import { HStack, Text, VStack, Icon, Container } from "@chakra-ui/react";
import {
  AiFillFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiFillYoutube,
} from "react-icons/ai";
import React from "react";

const Footer = () => {
  return (
    <Container maxW="1440px" w="full" p={0}>
      <VStack spacing={6} py={10}>
        <HStack spacing={6}>
          <Icon as={AiFillFacebook} />
          <Icon as={AiOutlineInstagram} />
          <Icon as={AiOutlineTwitter} />
          <Icon as={AiFillYoutube} />
        </HStack>
        <HStack spacing={10} fontSize={["xs", "xs", "md"]}>
          <Text>Condition of Use</Text>
          <Text>Privacy & Policy</Text>
          <Text>Press Room</Text>
        </HStack>
        <Text fontSize={["xs", "xs", "md"]}>©2023 Muuvi by Jafarzar</Text>
      </VStack>
    </Container>
  );
};

export default Footer;
