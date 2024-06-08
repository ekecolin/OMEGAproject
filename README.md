# OMEGA - Discord gamebot

OMEGA is a Discord chatbot designed to assist gamers with queries about various games. Using advanced similarity search, OMEGA retrieves information from indexed PDF walkthroughs in a Pinecone vector database, ensuring precise and relevant responses. Seamlessly integrated with Discord, OMEGA allows users to interact through text commands, enhancing their gaming experience with prompt and accurate guidance.

Beyond Discord, OMEGA is accessible via a dedicated website that supports both text and voice interaction, offering convenience and accessibility to a broader audience. The website also features a journal for users to save and organize tips provided by the chatbot, making it easy to revisit and reference valuable insights.

## Getting Started

1. Need a Discord account
2. Need a Pinecone account
3. Need an Elevenlabs account
4. Enter in your API keys in the env file such as Discord token, OpenAIKey, OPENAIOrganisation, ElevenlabsAPIKey, ElevenlabsVoiceID, PineconeAPIKey, PineconeEnvironment and PineconeIndexName

### Installing

#### PDF to Pinecone
1. Go to the srcofpdf folder
2. Install `npm install -g ts-node`
3. Install `npm install pdf-parse`
4. To execute, run: `ts-node scripts/createIndex.ts
5. To start on your server, run 'npm run dev'

#### Discord bot
1. Open another terminal to run the discord bot
2. To execute, run: 'node discordgamebot.js'

<img width="1710" alt="Screenshot 2024-06-08 at 09 57 53" src="https://github.com/ekecolin/OMEGAproject/assets/117390062/fe8307f5-e1c5-4be6-95de-0a460d1b1ed7">

