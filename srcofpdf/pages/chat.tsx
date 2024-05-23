// https://react.dev/learn/typescript
// https://www.freecodecamp.org/news/use-typescript-with-react/
// Imports from React, Next.js, Chakra UI, and utility functions
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { FaArrowAltCircleUp, FaArrowCircleLeft } from "react-icons/fa";
import Beatloader from "react-spinners/BeatLoader";
import base64ToBlob from "@/utils/basetoblob";
// https://chakra-ui.com/
import {
  Box,
  Button,
  HStack,
  Heading,
  Fade,
  Flex,
  Icon,
  Text,
  Textarea,
  VStack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import NameInput from "@/components/NameInput";
import { Message } from "@/types";

function Chat() {
  // State hooks for various functionalities
  // Set voice
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Reference for playing audio responses.
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Storing messages in the chat.
  const [messages, setMessages] = useState<Message[]>([]);  

  // Helper function to add messages to chat.
  const addMessage = (message: Message) => {  
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Displaying notifications and errors.
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // Tracking user input
  const [text, setText] = useState(""); 

  // Function to execute api request and communicate with open ai, pinecone & eleven labs
  const askAi = async (props?: { name?: string }) => {  
    // Check for user input or a provided name; show an error toast if missing. - https://deadsimplechat.com/blog/react-toastify-the-complete-guide/ 
    if (!text && !props?.name)
      return toast({
        title: "Please enter text to be able to use Omega",
        status: "error",
      });

    // Ensure a user name is set before proceeding; show an error toast if missing.
    if (!userName && !props?.name)
      return toast({
        title: "Enter your name first!",
        status: "error",
      });

    // Prepare the user message for sending.
    const message = { role: "user", content: text };

    // Add the user's message to the chat history and clear the input field.
    if (!props?.name) {
      addMessage({ role: "user", content: text });
      setText("");
    }

    // Show an error toast if unable to play audio.
    if (!audioRef.current)
      return toast({ title: "Error enabling audio, please check your remaining quota", status: "error" });

    setLoading(true);

    // Construct the request body for the AI service API call.
    const reqBody = {
      messages: props?.name ? undefined : [...messages, message],
      userName: userName || props?.name,
    };

    console.log("api reqBody:", reqBody);

    // Response for chat gpt - https://imrajeshberwal.medium.com/using-the-openai-chatgpt-api-in-a-typescript-application-57a761626c86
    // https://www.freecodecamp.org/news/how-to-fetch-data-from-an-api-using-the-fetch-api-in-javascript/
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    const jsonResp = await response.json();
    console.log("api jsonResp response:", jsonResp);

    setVoiceEnabled(jsonResp.voiceEnabled);

    // Add the AI's response to the chat history.
    const { audioDataBase64, translatedText } = jsonResp;
    addMessage({ role: "assistant", content: translatedText });

    const audioBlob = base64ToBlob(audioDataBase64, "audio/mpeg");

    // Check if audioBlob is not null before attempting to use it
    if (audioBlob !== null) {
        const audioURL = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioURL;
        await audioRef.current.play();
    } else {
        // Handle the case where audioBlob is null
        console.warn("Audio blob was null, unable to play audio.");
        // Optionally, you can implement additional logic here for when the audio cannot be played
    }

    setText("");

    try {
      setLoading(false);
    } catch (e: any) {
      console.log("Error:", e.message);
    }
  };

  // Allows mobile browsers to play audio with user interaction - designed to comply with browser autoplay policies 
  const startAudioForPermission = async () => { 
    if (!audioRef.current) return;
    await audioRef.current.play();
  };

  // Hook to initialize the audio element once component mounts. - https://legacy.reactjs.org/docs/hooks-intro.html
  // https://www.freecodecamp.org/news/react-hooks-fundamentals/ 
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const userBgColor = useColorModeValue("hsl(262, 100%, 59%)", "hsl(262, 100%, 59%)");
  const assistantBgColor = useColorModeValue("258, 89%, 39%, 0.759", "gray.700");
  const userColor = "white";
  const assistantColor = "white";

  const [userName, setUserName] = useState<null | string>(null);

  const assistantName = "Omega";

  return (
    // https://chakra-ui.com/ 
    <>
      <Head>
        <title>OMEGA Gamebot</title>
      </Head>
      
      <Box display="flex" flexDirection="column" bg="background">
      <VStack pt={40} px={4} mb={100} spacing={10} maxW="600px" mx="auto" flexGrow={1}>
        <Heading as="h1" color="white">
          WELCOME TO OMEGA
        </Heading>
        <Text color="hsl(228, 8%, 70%)" fontSize="s" style={{ marginBottom: '20px' }}>
          Start a conversation with OMEGA your Discord AI gamebot.
        </Text>
        
        <Fade in={!voiceEnabled} unmountOnExit={false}>
        {!voiceEnabled && (
        <Box
          textAlign="center"
          my={4}
          p={4} // Padding inside the box
          bg="red.500" // Background color similar to your send button
          borderRadius="lg" // Curved edges
          boxShadow="0 0 10px 0 rgba(255, 0, 0, 0.5)" // Shadow similar to the message boxes
          style={{ marginBottom: '30px', marginTop: '-10px' }}
        >
          <Text
            fontSize="md"
            fontWeight={600}
            color="white"
          >
            Oops! It looks like OMEGA voice response is currently unavailable, but don't worry, we're still here to help you out with text responses!
          </Text>
        </Box>
        )}
        </Fade>

        {!userName ? ( // Conditional rendering based on whether the userName state has been set.
          <NameInput
            onEnter={(name) => {
              startAudioForPermission();
              setUserName(name);
              askAi({ name });
            }}
          />
        ) : (
          // If userName is set, display the conversation UI.
          <>
            {messages.map((message, index) => { // Iterates over the messages state to display each message.
              const isUser = message.role === "user"; // Checks if the current message is from the user.
              <audio ref={audioRef} />;
              return (
                <Box
                  key={index}
                  alignSelf={isUser ? "flex-end" : "flex-start"} // Aligns user messages to the right and assistant messages to the left.
                  backgroundColor={isUser ? userBgColor : assistantBgColor} // Background color based on the message sender.
                  color={isUser ? userColor : assistantColor} // Text color based on the message sender.
                  borderRadius="lg"
                  boxShadow={isUser ? "0 0 10px 0 hsl(262, 100%, 59%)" : "0 0 10px 0 hsl(262, 100%, 59%)"} // Adds a shadow to the message box.
                  px={4}
                  py={2}
                  maxWidth="70%"
                  position="relative"
                >
                  <Text
                    fontSize="xs"
                    position="absolute"
                    color="white"
                    top={-6}
                    left={2}
                  >
                    {isUser ? userName : assistantName} 
                  </Text>
                  <Text fontSize="sm">{message.content}</Text> 
                </Box>
              );
            })}
            <VStack w="100%" spacing={4}>
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)} // Update the text state on change
                onKeyDown={(e) => {
                  // Calls askAi function when Enter key is pressed and prevents the default if Shift isn't held
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); // Prevent the default action (insert newline) from happening
                    askAi(); // Call your function to handle the submission
                  } else if (e.key === 'Enter' && e.shiftKey) {
                    // Allow multi-line inputs when Shift is held down, if desired
                    // If you do not want multi-line inputs at all, you can remove this else if block
                  }
                }}
                mt={8}
                color="white"
                placeholder="Type your message here..."
                size="sm"
                resize="none"
                borderColor="purple.500"
                _hover={{ borderColor: "purple.600" }}
                _focus={{ borderColor: "purple.700", boxShadow: "0 0 0 1px purple.700" }}
                overflow="hidden" // Prevent scrollbar from appearing
              />
            </VStack>

            <HStack w="100%" justify="space-between">
              <Flex>
                <Button
                  as="a"
                  marginTop={-4}
                  href="https://omega-pi.vercel.app/"
                  rightIcon={<Icon as={FaArrowCircleLeft} />}
                  _hover={{ bg: 'hsl(273, 72%, 50%)' }}
                  bg="hsl(262, 100%, 59%)"
                  color="white"
                  variant="solid"
                >
                  RETURN TO WEBPAGE
                </Button>
              </Flex>
              
              <Flex>
              <Button
                h={10}
                marginTop={-4}
                bg="hsl(262, 100%, 59%)"
                _hover={{ bg: 'hsl(273, 72%, 50%)' }}
                color="white"
                variant="solid"
                onClick={() => {
                  askAi(); // Submit the message on click

                  window.scrollTo({ // Scrolls to the bottom of the page to show the latest message.
                    left: 0,
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }}
                isLoading={loading}
                spinner={<Beatloader size={8} />}
                rightIcon={<Icon as={FaArrowAltCircleUp} />}
              >
                SEND
              </Button>
              </Flex>
            </HStack>

          </>
        )}
      </VStack>
      
  
      </Box>
    </>
  );
}

export default Chat;
