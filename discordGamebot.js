// Load environment variables from .env file
require('dotenv').config(); 

// Connecting to discord - importing necessary classes from discord.js library
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { Client, GatewayIntentBits } = require('discord.js');

// Creating new instance of the Client - Showing all the intents of different events our bot can have (from discord.js)
const gameBot = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Events related to discord server
    GatewayIntentBits.GuildMessages, // Events related to messages sent in discord server
    GatewayIntentBits.MessageContent, // Allows bot to receive text content
  ],
});

// Variable to track whether the bot has been started
let botStarted = false;

// =============== EVENT TRIGGERED WHEN THE BOT IS READY ============ //
gameBot.on('ready', () => {
  console.log(`Logged in as ${gameBot.user.tag}`);
  // Set a dynamic presence status
  gameBot.user.setPresence({
    activities: [{ name: 'your commands', type: 'WATCHING' }],
    status: 'online',
  });

  const welcomeMessages = [
    "👋 Hey there! Fully charged and raring to go. Dive into your next adventure by typing `!start`.",
    "Hey there! I am now online and ready to assist. Type `!start` to begin.",
    "🚀 Welcome aboard, Commander! Your mission, should you choose to accept it, begins with `!start`. Let the games begin!",
    "Welcome! I am here to help. Type `!start` to begin your gaming  adventure.",
    "🔥 Ignition sequence initiated! Your virtual co-pilot is at the controls. Punch in `!start` and let's blast off to gaming glory!",
    "Greetings! I'm ready to assist you. Type `!start` to get started.",
    "🌅 Rising from the realms of code, I awaken refreshed and ready for action! Let's tackle your gaming quests together. Just type `!start` and set forth into greatness.",
    "I'm awake, I'm awake, I'm up! You scared me there hahaha... I am here to help. Type `!start` and let's solve your problem(s).",
    "🎮 Powering up systems... Initialization complete! I'm your trusty game guide, eager to assist. Just type `!start` and let's unlock some secrets together!"
  ];

  // Get the channel where you want to send the welcome message
  const channel = gameBot.channels.cache.get('1178639384166281299'); // Replace '1178639384166281299' with the actual channel ID 1228256344952279103

  const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
  const randomWelcomeMessage = welcomeMessages[randomIndex];
  
  // Send the random welcome message
  channel.send(`${randomWelcomeMessage}`);
});

// ========== CHECKS TO SEE IF A MESSAGE IS SENT ON DISCORD ========== //
gameBot.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) return; // Ignore messages sent by bots

    const prefix = '!'; // Defined command prefix, e.g., '!start'
    const args = message.content.slice(prefix.length).trim().split(/ +/); // Split the message content into arguments
    const command = args.shift().toLowerCase(); // Split the message content into command

    const startMessages = [
      "Ah, eager to chat, I see! But first, let's make it official. Say `!start` to awaken me from my digital slumber. 😴✨",
      "Hold that thought! Looks like you dove right in. Let's backtrack — `!start` is where our journey begins. 🚀",
      "Hmm, I'm getting signals but no initiation. Did we forget something? Ah, yes! `!start` to commence our dialogue. 🌟",
      "I sense your enthusiasm! But it seems we missed the magic word. Whisper `!start` and I shall appear! 🧙‍♂️",
    ];

    const randomMessage = startMessages[Math.floor(Math.random() * startMessages.length)];

    // If a user tries to send a command before starting the bot, it will respond with a random message
    if (!botStarted && command !== 'start') {
      message.reply(`${randomMessage}`);
      return;
    }
 
    // =================== CLEAR MESSAGES COMMAND ================= //
    if (command === 'clear') {
        // Start typing indicator
        message.channel.sendTyping();

        // Notify the channel that OMEGA is deleting messages
        await message.channel.send("OMEGA is deleting...");
        try {
            const amount = parseInt(args[0]);
            const userName = message.author.username;

            // Validate the provided amount
            if (isNaN(amount) || amount <= 0) {
                return message.reply(`Hey ${userName}, please provide a valid number of messages to clear after the command. Example: \`!clear 5\`, which will delete 5 messages`);
            }
        
            // Deletes the specified number of messages without deleting the command message
            const messages = await message.channel.messages.fetch({ limit: amount + 1 });
            await message.channel.bulkDelete(messages);
    
            // Determine the appropriate term for the number of messages
            const messageTerm = amount === 1 ? 'message' : 'messages';
    
            // Provide a reply after successful deletion with the number of messages
            const replyContent = `Successfully deleted ${amount} ${messageTerm} ✅`;
            const replyMessage = await message.channel.send(replyContent);
    
            // Delay the deletion of the reply message for a longer duration - 2 seconds
            setTimeout(() => {
                replyMessage.delete();
            }, 2000); 
    
        } catch (error) {
            console.error(error);

            // Handle specific error cases
            if (error.code === 50035 && error.errors?.message_reference?._errors?.[0]?.code === 'REPLIES_UNKNOWN_MESSAGE') {
                console.warn('DiscordAPIError: Unknown message. Ignoring...');
            } else {
                return message.reply('An error occurred while clearing messages.');
            }
        }
    }

    // ========= START COMMAND TO BEGIN INTERACTION WITH BOT ========= //
    if (command === 'start') {
      // Start typing indicator
      message.channel.sendTyping();
      // Set botStarted to true once the bot is started
      botStarted = true;
      const userName = message.author.username;
      message.reply(`🌟 Welcome, ${userName}! Ready to elevate your gaming experience? I'm here to guide, assist, and ensure your adventure is epic.`);
      // Send another message after a short delay to inform about the next steps
      setTimeout(() => {
        message.reply(`📘 Type \`!help\` to discover how I can assist you further. View our list of commands.`);
      }, 800); // Adjusted delay for a smoother interaction
      return;
    }

    if (command === 'ask') {
      // Start typing indicator
      message.channel.sendTyping();
      // Prepare the data to send to your chatbot API
      const payload = {
        messages: [{ role: "user", content: args.join(" ") }],
        userName: message.author.username
      };
  
      // Define the URL of your chatbot API
      const apiURL = 'https://omega-chatbot-chi.vercel.app/api/chat_discord'; // Make sure to replace this with your actual API endpoint
  
      try {
        // Make a POST request to your chatbot API
        const response = await fetch(apiURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch from the chatbot API: ${response.statusText}`);
        }
  
        // Parse the JSON response from your chatbot API
        const chatbotReply = await response.json();

        const greetingRegex = new RegExp(`^\\s*(Hello|Hi|Hey)\\s+\\w+\\b[.,!]?\\s`, 'i');

        // Remove the 'Omega: ' prefix from the reply before sending to Discord
        let finalReply = chatbotReply.translatedText
          .replace(/^Omega:\s*/, '')
          .replace(greetingRegex, '')
          .replace(/^Response:\s*/, '')
          .replace(/Hello,?\s+\w+[.!]/, '');
  
        // Respond to the Discord message with the chatbot's answer
        message.reply(finalReply);
      } catch (error) {
        console.error(error);
        message.reply('There was an issue processing your question. Please try again.');
      }
    }

    if (command === 'askweb') {
      message.channel.sendTyping();
      const userName = message.author.username;
      const replyMessage = await message.reply(`Thanks for trusting us to answer your question, ${userName}! Do you need assistance with the game you are playing? Type 'Yes' or 'No'.`);
    
      // Add a collector to wait for the user's response
      const collector = message.channel.createMessageCollector({
        filter: response => ['yes', 'no'].includes(response.content.toLowerCase()) && response.author.id === message.author.id,
        time: 30000 // 30 seconds timeout
      });
    
      collector.on('collect', async response => {
        const answer = response.content.toLowerCase();
        if (answer === 'yes') {
          const secondReply = await message.reply("Would you like to gain access to our exclusive website where you can use OMEGA a game helper chatbot catered to answering your needs? Type 'Yes' or 'No'");
    
          // Add another collector for the second question
          const secondCollector = message.channel.createMessageCollector({
            filter: secondResponse => ['yes', 'no'].includes(secondResponse.content.toLowerCase()) && secondResponse.author.id === message.author.id,
            time: 30000 // 30 seconds timeout
          });
    
          secondCollector.on('collect', async secondResponse => {
            const secondAnswer = secondResponse.content.toLowerCase();
            if (secondAnswer === 'yes') {
              // Handle the case where the user wants to access the exclusive website
              secondResponse.reply(`Great ${userName}! Here is the access to our exclusive website at https://omega-pi.vercel.app/`);
            } else if (secondAnswer === 'no') {
              // Handle the case where the user doesn't want to access the exclusive website
              secondResponse.reply(`No problem ${userName}. If you have any other questions or need assistance, feel free to ask!`);
            }
            // Stop the second collector after processing the response
            secondCollector.stop();
          });
    
        } else if (answer === 'no') {
          // Handle the case where the user doesn't want assistance with the game
          replyMessage.reply(`No problem ${userName}.`);
        }
    
        // Stop the collector after processing the response
        collector.stop();
      });
    
      // Handle the case where there's no response within the timeout
      collector.on('end', collected => {
        if (collected.size === 0) {
          // userName is available here, so we define the messages inside this scope
          const timeoutMessages = [
            `Hey ${userName}, it looks like you took a bit too long. No worries, I'm still here if you need help!`,
            `Oops, ${userName}! Time ran out. I'm here all day, though, so ask away whenever you're ready.`,
            `It seems you got distracted, ${userName}. Whenever you're back, I'm ready to assist with your gaming questions.`,
            `Hey ${userName}, it seems you wandered off. Remember, I'm here to help whenever you decide to return!`
          ];
      
          // Select a random message from the array
          const randomMessage = timeoutMessages[Math.floor(Math.random() * timeoutMessages.length)];
          replyMessage.reply(randomMessage);
        }
      });
    
      return;
    }

    // Map to store command details
    const commandDetails = {
      ask: {
        description: 'Ask a question to receive help from OMEGA',
        usage: '!ask',
        example: '!ask who is Gort in Shining Force',
      },
      askweb: { 
        description: 'Dont want to use OMEGA on discord? Use the web version instead!',
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
        description: 'Check the bot\'s latency',
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

    // Inside the 'messageCreate' event handler
    if (command === 'help') {
      message.channel.sendTyping();
      const userName = message.author.username;
      let helpMessage = `Hello ${userName}! Here are the available commands and their details:\n`;

      // Loop through commandDetails and append details to helpMessage
      for (const [cmd, details] of Object.entries(commandDetails)) {
        helpMessage += `\n**${cmd}** - ${details.description}\n`;
        helpMessage += `Usage: \`${details.usage}\`\nExample: \`${details.example}\`\n`;
      }

      message.reply(helpMessage);
      return;
    }

    if (command === 'ping') {
      const pingMessage = await message.reply('Pinging...');
      pingMessage.edit(`Pong! Latency is ${pingMessage.createdTimestamp - message.createdTimestamp}ms.`);
      return;
    }   

    if (command === 'flipcoin') {
      // Reply with the flipping animation
      const flippingMessage = await message.reply(`I'm flipping the coin now...`);

      // Generate a random number (0 or 1) to simulate heads or tails after a delay
      setTimeout(() => {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        // Edit the original message with the result
        flippingMessage.edit(`The coin landed on: ${result}`);
      }, 2000);

      return;
    }

    if (command === 'roll') {
      // Reply with the rolling animation
      const flippingMessage = await message.reply(`I'm rolling the dice now...`);

      // Delay the result to simulate the rolling animation
      setTimeout(() => {
        const sides = parseInt(args[0]) || 6; // Parse the number of sides from the command arguments or default to 6
        const result = Math.floor(Math.random() * sides) + 1; // Generate a random result between 1 and the specified number of sides
        flippingMessage.edit(`You rolled a ${result}.`);
      }, 2000); 

      return;
    }

    // Error handling code for other situations
  } catch (err) {
    console.error(err);
    message.reply('An error occurred while processing your command. Please try again.');
    setTimeout(() => {
      message.reply('Ensure you have typed the correct command, if you are unsure you can check our help section by typing `!help`');
    }, 2000); 

    return;
  }
});

gameBot.login(process.env.DISCORD_TOKEN);
console.log("Your Gamebot Helper is now ready to assist you on Discord!");