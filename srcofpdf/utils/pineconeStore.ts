// https://docs.pinecone.io/docs/new-api
// https://sdk.pinecone.io/typescript/
// Importing dotenv package for loading environment variables from .env file
import * as dotenv from "dotenv";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// Initialize dotenv to read .env file
dotenv.config();

const pineconeStore = async () => {
  // Initialize a new PineconeClient object using our API and environemnt key
  const pinecone = new PineconeClient();
  // Initialize a new OpenAIEmbeddings object to be used for generating embeddings 
  const embedder = new OpenAIEmbeddings();

  // Call the init method on the Pinecone client to configure it with environment and API key
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT as string,
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  // The index name is retrieved from environment variables
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX as string);

  // This sets up a connection to an existing Pinecone index with the capability to use embeddings
  const pineconeStore = await PineconeStore.fromExistingIndex(embedder, {
    pineconeIndex,
  });

  return pineconeStore;
};

export default pineconeStore;
