const dotenv = require("dotenv");

const { PineconeClient } = require("@pinecone-database/pinecone");
const langDoc = require("langchain/document");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { CharacterTextSplitter } = require("langchain/text_splitter");

dotenv.config();
console.log(`PINECONE_API_KEY: ${process.env.PINECONE_API_KEY}`);
console.log(`PINECONE_ENVIRONMENT: ${process.env.PINECONE_ENVIRONMENT}`);
console.log(`PINECONE_INDEX: ${process.env.PINECONE_INDEX}`);

(async () => {
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY as string,
    environment: process.env.PINECONE_ENVIRONMENT as string,
  });

  const pineconeIndex = client.Index(process.env.PINECONE_INDEX as string);

  const loader = new PDFLoader("./scripts/INSERT_NAME_OF_PDF_HERE", {
    splitPages: false,
  });
  const docs = await loader.load();

  const splitter = new CharacterTextSplitter({
    separator: "\n",
    chunkSize: 2000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(docs);


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