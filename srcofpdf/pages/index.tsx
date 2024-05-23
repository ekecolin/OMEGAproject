import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { FaArrowAltCircleUp, FaArrowCircleLeft } from "react-icons/fa";
import Beatloader from "react-spinners/BeatLoader";
import base64ToBlob from "@/utils/basetoblob";
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

function Home() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);  

  const addMessage = (message: Message) => {  
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState(""); 

  const askAi = async (props?: { name?: string }) => {  
    if (!text && !props?.name)
      return toast({
        title: "Please enter text to be able to use Omega",
        status: "error",
      });

    if (!userName && !props?.name)
      return toast({
        title: "Enter your name first!",
        status: "error",
      });

    const message = { role: "user", content: text };

    if (!props?.name) {
      addMessage({ role: "user", content: text });
      setText("");
    }

    if (!audioRef.current)
      return toast({ title: "Error enabling audio, please check your remaining quota", status: "error" });

    setLoading(true);

    const reqBody = {
      messages: props?.name ? undefined : [...messages, message],
      userName: userName || props?.name,
    };

    console.log("api reqBody:", reqBody);

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

    const { audioDataBase64, translatedText } = jsonResp;
    addMessage({ role: "assistant", content: translatedText });

    const audioBlob = base64ToBlob(audioDataBase64, "audio/mpeg");

    if (audioBlob !== null) {
        const audioURL = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioURL;
        await audioRef.current.play();
    } else {
        console.warn("Audio blob was null, unable to play audio.");
    }

    setText("");

    try {
      setLoading(false);
    } catch (e: any) {
      console.log("Error:", e.message);
    }
  };

  const startAudioForPermission = async () => { 
    if (!audioRef.current) return;
    await audioRef.current.play();
  };

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
    <>
      <Head>
        <title>OMEGA Gamebot</title>
        <link rel="icon" href="favicon.png" type="image/png" />
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
          p={4} 
          bg="red.500" 
          borderRadius="lg"
          boxShadow="0 0 10px 0 rgba(255, 0, 0, 0.5)" 
          style={{ marginBottom: '30px', marginTop: '-10px' }}
        >
          <Text
            fontSize="md"
            fontWeight={600}
            color="white"
          >
            Oops! It looks like OMEGA voice response is currently unavailable, but don't worry, we're still here to help you out using text responses!
          </Text>
        </Box>
        )}
        </Fade>

        {!userName ? ( 
          <NameInput
            onEnter={(name) => {
              startAudioForPermission();
              setUserName(name);
              askAi({ name });
            }}
          />
        ) : (
          <>
            {messages.map((message, index) => { 
              const isUser = message.role === "user"; 
              <audio ref={audioRef} />;
              return (
                <Box
                  key={index}
                  alignSelf={isUser ? "flex-end" : "flex-start"} 
                  backgroundColor={isUser ? userBgColor : assistantBgColor} 
                  color={isUser ? userColor : assistantColor} 
                  borderRadius="lg"
                  boxShadow={isUser ? "0 0 10px 0 hsl(262, 100%, 59%)" : "0 0 10px 0 hsl(262, 100%, 59%)"} 
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
                onChange={(e) => setText(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); 
                    askAi(); 
                  } else if (e.key === 'Enter' && e.shiftKey) {
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
                overflow="hidden" 
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
                  askAi(); 

                  window.scrollTo({ 
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
      <Button
        onClick={scrollTop}
        position="fixed"
        bottom="50px"
        right="20px"
        zIndex="tooltip"
        size="s"
        bg="hsl(228, 6%, 12%)" 
        color="#fff" 
        boxShadow="0 12px 24px rgba(0, 0, 0, 0.5)"
        _hover={{
          transform: "translateY(-0.25rem)", 
        }}
        aria-label="Scroll to top"
        transition="transform 0.2s, background-color 0.2s"
        borderRadius="0" 
        p="0.2rem 0.3rem" 
      >
        <i className="ri-arrow-up-line" style={{ fontSize: '20px' }}></i>
      </Button>
  
      </Box>
    </>
  );
}

export default Home;
