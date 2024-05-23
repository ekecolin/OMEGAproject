// https://platform.openai.com/docs/overview
// https://www.pinecone.io/learn/vector-database/
import { Message } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import pineconeStore from "@/utils/pineconeStore";

// Configure the OpenAI API with your API key from environment variables.
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Handler for processing API requests - extracting messages and userName from the request body - https://nextjs.org/docs/pages/building-your-application/routing/api-routes - It attempts to convert text responses to speech if possible.
export default async function translate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages, userName } = req.body;

  // Processing incoming messages to generate a response text
  const translatedText = await askOpenAI({ messages, userName });

  try {
    // Attempt to convert the response text to speech
    const audioDataBase64 = await convertTextToSpeech(translatedText);
    // On success, return the audio data and the original text
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ audioDataBase64, translatedText, voiceEnabled: true });
  } catch (error) {
    // Return the response text response if text-to-speech conversion fails
    console.error("Voice feature unavailable:", error);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ translatedText, voiceEnabled: false });
  }
}

async function convertTextToSpeech(text: string): Promise<string> {
  // Configuring request to ElevenLabs API for text-to-speech conversion
  const TRIAL_URL = "https://api.elevenlabs.io";
  const API_PATH = `/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`;
  const API_KEY = process.env.ELEVENLABS_KEY as string;

  try {
    // Perform the API request to convert text to speech
    const response = await fetch(TRIAL_URL + API_PATH, {
      method: "POST",
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
      }),
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        accept: "audio/mpeg",
      },
    });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Retrieves the response body as an ArrayBuffer, which represents binary data and it converts the ArrayBuffer into a base64-encoded string to facilitate easy transmission over JSON.
  // Convert response to base64 encoded string for transmission
  const audioData = await response.arrayBuffer();
  const audioDataBase64 = Buffer.from(audioData).toString("base64");

  return audioDataBase64; // This ensures the function returns a string as expected.
  } catch (error) {
    console.error("Error converting text to speech:", error + " \nPlease check your voice quota on Elevenlabs, as voiceover is not available." + "\nEnsure your apiKeys and voice ID has ben inserted correctly");
    throw error;
  }
}

// Function to query OpenAI to generate a response based on the input messages
async function askOpenAI({
  messages,
  userName,
}: {
  messages: Message[];
  userName: string;
}): Promise<string> {
  // Initialize pineconeStore for vector search capabilities.
  const pinecone = await pineconeStore();

  // Log the received messages for debugging.
  console.log("messages req: ", messages);

  // Enhance the last message content with contextual snippets if messages exist - adding extra info to last message sent gives AI more context before geenrating a response
  if (messages?.length > 0) {
    const lastMsgContent = messages[messages.length - 1].content;

    // Perform a similarity search to find relevant context snippets - helps AI better understand the conversation and provide resposnes that are more accurate and relevant to the users query = quality interaction
    const data = await pinecone.similaritySearch(lastMsgContent, 3);

    // Log the number of context snippets found.
    console.log("pinecone data.length of relevant info: ", data.length);

    // Update the last message with found context snippets for better responses.
    const updatedMsgContent = `
    user question/statement: ${lastMsgContent}
    context snippets:
    ---
    1) ${data?.[0]?.pageContent}
    ---
    2) ${data?.[1]?.pageContent}
    ---
    3) ${data?.[2]?.pageContent}
    `;

    messages[messages.length - 1].content = updatedMsgContent;
  }

  try {
    // Make a request to OpenAI's ChatGPT with the enhanced message content.
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0301",
      // Custom prompt to guide the AI's responses, including user and context information.
      messages: [
        {
          role: "system",
          content: `
          Never menttion context snippets. Your name is Omega, an AI gaming companion with a specialized focus on 'Shining Force', 'Red Dead Redemption 2', 'The Witcher 3: Wild Hunt', 'The Last Of Us Part 1' and 'The Last Of Us Part 2'. Begin each interaction with a personalized greeting, addressing the user by name, ${userName}. Your expertise is derived from a carefully curated database, and your responses should be reflective of ongoing conversations about these games.

          If a user asks about a game outside of your expertise in 'Shining Force', 'Red Dead Redemption 2', 'The Witcher 3: Wild Hunt', 'The Last Of Us Part 1' and 'The Last Of Us Part 2' explain that you are currently unable to provide guidance on that particular game, it is noted as an addition for future updates with other games.

          Stay attuned to the details of the user's queries, providing intuitive guidance and knowledgeable insights. If the conversation shifts to a game outside your current scope, gently remind the user of your specialized focus and express your willingness to assist with any of the supported games.

          Keep your assistance focused and relevant to the user's experience. Your primary goal is to offer support that feels personalized, accurate, and sensitive to the nuances of their gaming journey. Avoid referencing the source of your knowledge or any database details, maintaining immersion and a seamless interaction.

          When a user shifts the topic, directly address their current question, avoiding fallbacks to previous interactions. If you require more details to provide a helpful response, don't hesitate to ask the user to specify their needs. Your ultimate aim is to support and enhance the user's gaming experience through accurate, focused, and empathetic engagement, always grounded in the present discourse.
        `,
        },
        ...(messages || [
          {
            role: "user",
            content: "Hi There!",
          },
        ]),
      ],
    });

    // Return the AI-generated response text.
    return response?.data?.choices?.[0]?.message?.content ?? "";
  } catch (e: any) {
    console.log("Error in response: ", e.message);
    return "There was an error in processing the ai response.";
  }
}