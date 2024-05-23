// commands.js
async function startCommand(message) {
    return message.reply(`Welcome! Ready to elevate your gaming experience?`);
}

async function clearCommand(message) {
    const args = message.content.split(' ').slice(1);
    const numMessagesToClear = parseInt(args[0]);

    console.log("Clear command called");

    // Adjusted: Assuming fetchedMessages is a Map to simulate fetching messages
    const fetchedMessages = await message.channel.messages.fetch({ limit: numMessagesToClear + 1 });
    
    // Adjusted to call bulkDelete correctly according to the mock setup
    await message.channel.messages.bulkDelete(fetchedMessages.size);

    // Respond to indicate the mock clear command executed
    message.channel.send(`Mock: Successfully deleted ${numMessagesToClear} messages ✅`);
}

async function askCommand(message) {
    const args = message.content.split(' ').slice(1);
    const question = args.join(' ');
    console.log("Ask command called with question:", question);

    // For testing, you might want to mock this fetch call
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: "user", content: question }],
                userName: message.author.username
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from the chatbot API');
        }

        const data = await response.json();
        message.reply(data.translatedText); // Adjust based on the actual API response structure
    } catch (error) {
        console.error("Ask command error:", error);
        message.reply('Sorry, there was an issue processing your question. Please try again later.');
    }
}

async function askWebCommand(message) {
    // Initial reply to the !askweb command
    await message.reply(`Thanks for trusting us to answer your question, ${message.author.username}! Do you need assistance with the game you are playing? Type 'Yes' or 'No'.`);
    
    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, time: 15000, max: 1 });

    collector.on('collect', m => {
        if (m.content.toLowerCase() === 'yes') {
            message.channel.send("Great! Here's the link to our exclusive website: http://example.com");
        } else {
            message.channel.send("No problem, feel free to ask if you have other questions!");
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            message.channel.send("Looks like you're busy, reach out if you need anything later!");
        }
    });
}

async function helpCommand(message) {
    const commandDetails = {
            ask: {
                description: 'Ask a question to receive help from OMEGA',
                usage: '!ask [question]',
                example: '!ask who is Gort in Shining Force?',
            },
            askweb: { 
                description: "Don't want to use OMEGA on Discord? Use the web version instead!",
                usage: '!askweb',
                example: '!askweb',
            },
            clear: {
                description: 'Delete a specified number of messages',
                usage: '!clear <number>',
                example: '!clear 5',
            },
            flipcoin: {
                description: 'Flip a coin (randomly generates Heads or Tails)',
                usage: '!flipcoin',
                example: '!flipcoin',
            },
            help: {
                description: 'Display information about available commands',
                usage: '!help',
                example: '!help',
            },
            ping: {
                description: "Check the bot's latency",
                usage: '!ping',
                example: '!ping',
            },
            roll: {
                description: 'Roll a dice with a specified number of sides (default is 6)',
                usage: '!roll [sides]',
                example: '!roll 20',
            },
            start: {
                description: 'Begin interaction with the chatbot',
                usage: '!start',
                example: '!start',
            },
        };
      
        let helpMessage = `Hello ${message.author.username}! Here are the available commands and their details:\n\n`;
        for (const [command, details] of Object.entries(commandDetails)) {
          helpMessage += `**${command}** - ${details.description}\nUsage: ${details.usage}\nExample: ${details.example}\n\n`;
        }
      
        return message.reply(helpMessage);
      }


async function pingCommand(message) {
    const pingMessage = await message.reply('Pinging...');
    return pingMessage.edit(`Pong!`);
}

module.exports = { startCommand, clearCommand, askCommand, askWebCommand, helpCommand, pingCommand };

