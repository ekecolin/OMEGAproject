// https://react.dev/reference/react/useState
// https://chakra-ui.com/
import React, { useState } from "react";
import { FaArrowCircleLeft, FaArrowAltCircleUp } from "react-icons/fa";
import { Box, Button, FormControl, FormLabel, Input, Icon, Flex } from "@chakra-ui/react";
import { handleEnterKeyPress } from "@/utils";

// The NameInput component accepts a single prop: onEnter, a function is run when called with the name value.
const NameInput = ({ onEnter }: { onEnter: (name: string) => void }) => {
  const [name, setName] = useState("");

  // Function to handle changes in the input field, updating the `name` state.
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
          color="white" // Set the text color to white
          sx={{
            '::placeholder': {
              color: 'hsl(228, 8%, 70%)', // Placeholder color
            },
            background: 'transparent', // Optional: if you want the background to be transparent
            borderColor: 'hsl(262, 100%, 59%)', // Optional: if you want the border color to be white
          }}
        />
      </FormControl>
      <Flex justifyContent="space-between" w="100%" mt={6}>
          <Button as="a" href="https://omega-pi.vercel.app/" leftIcon={<Icon as={FaArrowCircleLeft} />} _hover={{ bg: 'hsl(273, 72%, 50%)' }} bg="hsl(262, 100%, 59%)" color="white" variant="solid">
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

