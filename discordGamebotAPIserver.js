const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 3000;

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function truncateResponse(response) {
  return response.slice(0, 2000);
}

async function askOpenAI(userName, userMessage) {
    const systemMessage = {
      role: "system",
      content: ``, // Make your own prompt for the chatbot
    };

    const messages = [systemMessage].concat(conversation, { role: "user", content: userMessage });

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages
        });

        const botResponse = response.data.choices[0].message.content;

        userConversations[userName] = messages.concat({ role: "assistant", content: botResponse });

        const truncatedResponse = truncateResponse(botResponse);

        const formattedResponse = capitalizeFirstLetter(truncatedResponse);

        return formattedResponse;
    } catch (error) {
        console.error("Error querying OpenAI:", error);
        throw new Error('Failed to communicate with OpenAI.');
    }
}

app.post('/chat_discord', async (req, res) => {
    const { userName, userMessage } = req.body;

    try {
        const botResponse = await askOpenAI(userName, userMessage);
        res.json({ botResponse });
    } catch (error) {
        console.error("Error handling chat request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server running at https://omega-pi.vercel.app/`);
});
