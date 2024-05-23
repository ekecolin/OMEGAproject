import { Message } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import pineconeStore from "@/utils/pineconeStore";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function translate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { messages, userName } = req.body;

  const translatedText = await askOpenAI({ messages, userName });

  try {
    const audioDataBase64 = await convertTextToSpeech(translatedText);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ audioDataBase64, translatedText, voiceEnabled: true });
  } catch (error) {
    console.error("Voice feature unavailable:", error);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ translatedText, voiceEnabled: false });
  }
}

async function convertTextToSpeech(text: string): Promise<string> {
  const TRIAL_URL = "https://api.elevenlabs.io";
  const API_PATH = `/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`;
  const API_KEY = process.env.ELEVENLABS_KEY as string;

  try {
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

  const audioData = await response.arrayBuffer();
  const audioDataBase64 = Buffer.from(audioData).toString("base64");

  return audioDataBase64; 
  } catch (error) {
    console.error("Error converting text to speech:", error);
    throw error;
  }
}

async function askOpenAI({
  messages,
  userName,
}: {
  messages: Message[];
  userName: string;
}): Promise<string> {
  const pinecone = await pineconeStore();

  console.log("messages req: ", messages);

  if (messages?.length > 0) {
    const lastMsgContent = messages[messages.length - 1].content;

    const data = await pinecone.similaritySearch(lastMsgContent, 3);

    console.log("pinecone data.length of relevant info: ", data.length);

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
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0301",
      messages: [
        {
          role: "system",
          content: ``, // Make your own prompt for the chatbot
        },
        ...(messages || [
          {
            role: "user",
            content: "Hi There!",
          },
        ]),
      ],
    });

    return response?.data?.choices?.[0]?.message?.content ?? "";
  } catch (e: any) {
    console.log("Error in response: ", e.message);
    return "There was an error in processing the ai response.";
  }
}