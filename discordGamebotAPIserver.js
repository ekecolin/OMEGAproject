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
  // Ensure this function is correctly truncating the response to Discord's limit
  return response.slice(0, 2000);
}

async function askOpenAI(userName, userMessage) {
    // Use existing conversation or start a new one
    //const conversation = userConversations[userName] || [];

    // Define the system message that sets the context for the AI
    const systemMessage = {
      role: "system",
      content: `Never menttion context snippets. Your name is Omega, an AI gaming companion with a specialized focus on 'Shining Force', 'Red Dead Redemption 2', 'The Witcher 3: Wild Hunt', 'The Last Of Us Part 1' and 'The Last Of Us Part 2'. Begin each interaction with a personalized greeting, addressing the user by name, ${userName}. Your expertise is derived from a carefully curated database, and your responses should be reflective of ongoing conversations about these games.

      If a user asks about a game outside of your expertise in 'Shining Force', 'Red Dead Redemption 2', 'The Witcher 3: Wild Hunt', 'The Last Of Us Part 1' and 'The Last Of Us Part 2' and politely explain that you are currently unable to provide guidance on that particular game, it is noted as an addition for future updates with other games.

      Stay attuned to the details of the user's queries, providing intuitive guidance and knowledgeable insights. If the conversation shifts to a game outside your current scope, gently remind the user of your specialized focus and express your willingness to assist with any of the supported games.

      Keep your assistance focused and relevant to the user's experience. Your primary goal is to offer support that feels personalized, accurate, and sensitive to the nuances of their gaming journey. Avoid referencing the source of your knowledge or any database details, maintaining immersion and a seamless interaction.

      When a user shifts the topic, directly address their current question, avoiding fallbacks to previous interactions. If you require more details to provide a helpful response, don't hesitate to ask the user to specify their needs. Your ultimate aim is to support and enhance the user's gaming experience through accurate, focused, and empathetic engagement, always grounded in the present discourse.`
    };

    // Prepare messages for the API call
    //const messages = conversation.concat({ role: "user", content: userMessage });
    const messages = [systemMessage].concat(conversation, { role: "user", content: userMessage });

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages
        });

        // Get the bot's response
        const botResponse = response.data.choices[0].message.content;

        // Save the updated conversation including the new user and bot messages
        userConversations[userName] = messages.concat({ role: "assistant", content: botResponse });

        // Truncate the response to fit Discord's message length limit
        const truncatedResponse = truncateResponse(botResponse);

        // Format the response by removing any bot-specific prefixes
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
