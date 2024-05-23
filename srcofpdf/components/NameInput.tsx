import React, { useState } from "react";
import { FaArrowCircleLeft, FaArrowAltCircleUp } from "react-icons/fa";
import { Box, Button, FormControl, FormLabel, Input, Icon, Flex } from "@chakra-ui/react";
import { handleEnterKeyPress } from "@/utils";

const NameInput = ({ onEnter }: { onEnter: (name: string) => void }) => {
  const [name, setName] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <Box width="100%">
      <FormControl id="name" mt={-4}>
        <FormLabel color="white">What is your name?</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={handleChange}
          onKeyDown={handleEnterKeyPress(() => {
            onEnter(name);
          })}
          mt={2}
          placeholder="Enter your name"
          color="white" 
          sx={{
            '::placeholder': {
              color: 'hsl(228, 8%, 70%)', 
            },
            background: 'transparent', 
            borderColor: 'hsl(262, 100%, 59%)', 
          }}
        />
      </FormControl>
      <Flex justifyContent="space-between" w="100%" mt={6}>
          <Button as="a" href="https://omegaproject-public.vercel.app/" leftIcon={<Icon as={FaArrowCircleLeft} />} _hover={{ bg: 'hsl(273, 72%, 50%)' }} bg="hsl(262, 100%, 59%)" color="white" variant="solid">
            RETURN TO WEBPAGE
          </Button>
          <Button colorScheme="whiteAlpha" h={10} color="white" bg="hsl(262, 100%, 59%)" _hover={{ bg: "hsl(273, 72%, 50%)" }} onClick={() => onEnter(name)} isDisabled={!name.trim()} rightIcon={<Icon as={FaArrowAltCircleUp} />}>
            SUBMIT
          </Button>
        </Flex>
    </Box>
  );
};

export default NameInput;

