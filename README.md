# OMEGA - Discord gamebot

OMEGA is a Discord chatbot designed to assist gamers with queries about various games. Using advanced similarity search, OMEGA retrieves information from indexed PDF walkthroughs in a Pinecone vector database, ensuring precise and relevant responses. Seamlessly integrated with Discord, OMEGA allows users to interact through text commands, enhancing their gaming experience with prompt and accurate guidance.

Beyond Discord, OMEGA is accessible via a dedicated website that supports both text and voice interaction, offering convenience and accessibility to a broader audience. The website also features a journal for users to save and organize tips provided by the chatbot, making it easy to revisit and reference valuable insights.

## Getting Started

1. Need a Discord account
2. Need a Pinecone account
3. Need an Elevenlabs account

### Installing

#### PDF to Pinecone
1. Install `npm install -g ts-node`
2. Install `npm install pdf-parse`
3. To execute, run: `ts-node scripts/createIndex.ts
4. To start on your server, run 'npm run dev'

#### Discord bot 
1. To execute, run: 'node discordgamebot.js'


