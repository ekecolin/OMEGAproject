/**Script for creating a new Pinecone index and uploading documents to it*/
// Load environment variables from a .env file
const dotenv = require("dotenv");

// Import required modules from Pinecone, LangChain, and other utilities
// https://docs.pinecone.io/docs/new-api
// https://js.langchain.com/docs/integrations/vectorstores/pinecone
// https://platform.openai.com/docs/overview
// https://python.langchain.com/docs/modules/data_connection/vectorstores/
const { PineconeClient } = require("@pinecone-database/pinecone");
const langDoc = require("langchain/document");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { CharacterTextSplitter } = require("langchain/text_splitter");

// Initialize dotenv to read .env file and logging current configuration for debugging
dotenv.config();
console.log(`PINECONE_API_KEY: ${process.env.PINECONE_API_KEY}`);
console.log(`PINECONE_ENVIRONMENT: ${process.env.PINECONE_ENVIRONMENT}`);
console.log(`PINECONE_INDEX: ${process.env.PINECONE_INDEX}`);

(async () => {
  // Initialize the Pinecone client with your API key and environment from .env
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY as string,
    environment: process.env.PINECONE_ENVIRONMENT as string,
  });

  // Name index we want to upload to
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX as string);

  // Load PDF document from file path
  const loader = new PDFLoader("./scripts/INSERT_NAME_OF_PDF_HERE", {
    splitPages: false,
  });
  const docs = await loader.load();

  // Splitting PDF into chunks
  const splitter = new CharacterTextSplitter({
    separator: "\n",
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  // Split documents
  const splitDocs = await splitter.splitDocuments(docs);

  // Uploade chunks to pinecone index
  await PineconeStore.fromDocuments(splitDocs, new OpenAIEmbeddings(), {
    pineconeIndex,
  });
})();


/**
 * 1) Need to have a Pinecone account and have created an index and provide pinecone credentials
 * 2) Install `npm install -g ts-node` globally so you can run this script
 * 3) Install `npm install pdf-parse` globally to get this to work
 * 4) To execute, run: `ts-node scripts/createIndex.ts
 * 5) To start on your server, run 'npm run dev'
*/