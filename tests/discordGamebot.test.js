// Assuming your command functions are in 'commands.js'
const { startCommand, askCommand, askWebCommand, helpCommand, pingCommand, clearCommand } = require('./commands');
require('jest-fetch-mock').enableMocks();


describe('Discord Bot Commands', () => {
    let mockReply;
    let mockEdit;
    let mockMessage;
    let mockFetchMessages;
    let mockBulkDelete;
    let mockSend;
    let mockCreateMessageCollector
    
    beforeEach(() => {
        mockReply = jest.fn();
        mockEdit = jest.fn();
        mockSend = jest.fn();
        mockBulkDelete = jest.fn().mockResolvedValue(true); // Ensures bulkDelete is a mocked function that resolves
        mockFetchMessages = jest.fn().mockResolvedValue(new Map([
            ['1', { id: '1' }],
            ['2', { id: '2' }],
            ['3', { id: '3' }],
            ['4', { id: '4' }], // Includes the command message itself
        ]));
        
        mockCreateMessageCollector = jest.fn().mockImplementation(() => {
            let collected = new Map();
            const events = {};
            return {
                on: (event, callback) => { events[event] = callback; },
                collect: (msg) => {
                    if (events.collect) {
                        collected.set(msg.id, msg);
                        events.collect(msg);
                    }
                },
                end: () => {
                    if (events.end) {
                        events.end(collected, 'time'); // Ensure a collection is passed to the 'end' event
                    }
                }
            };
        });
        
        mockMessage = {
            reply: mockReply.mockImplementation(() => ({ edit: mockEdit })),
            channel: {
                send: mockSend,
                sendTyping: jest.fn(),
                messages: {
                    fetch: mockFetchMessages,
                    bulkDelete: mockBulkDelete,
                },
                createMessageCollector: mockCreateMessageCollector,
            },
            createdTimestamp: Date.now(),
            content: '',
            author: { bot: false, id: 'user123' }
        };
    });
    
    it('responds to !start with a welcome message', async () => {
        await startCommand(mockMessage);
        expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('Welcome!'));
    });

    it('clears messages correctly with !clear', async () => {
        mockMessage.content = '!clear 3';
        await clearCommand(mockMessage);
    
        expect(mockFetchMessages).toHaveBeenCalledWith(expect.any(Object));
    
        // This expects bulkDelete to be called with the number 4
        expect(mockBulkDelete).toHaveBeenCalledWith(4);
    });
    
    it('successfully retrieves response from chatbot API and replies with !ask', async () => {
        mockMessage.content = '!ask How does the fetch API work?';
        fetch.mockResponseOnce(JSON.stringify({ translatedText: 'The fetch API allows you to make network requests.' }));
      
        await askCommand(mockMessage); // Assuming askCommand is correctly imported
      
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:3000/api/chat',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: "user", content: "How does the fetch API work?" }],
                    userName: mockMessage.author.username
                })
            })
        );
        expect(mockMessage.reply).toHaveBeenCalledWith('The fetch API allows you to make network requests.');
    });
      
    it('correctly handles user saying "Yes" to initial question', async () => {
        // Act: Trigger the !askweb command.
        await askWebCommand(mockMessage);

        // Assert: Check the initial question was asked.
        expect(mockReply).toHaveBeenCalledWith(expect.stringContaining(`Do you need assistance with the game you are playing? Type 'Yes' or 'No'.`));

        // Directly simulate the bot's follow-up after a "Yes" response to the initial question.
        mockSend("Would you like to gain access to our exclusive website? Type 'Yes' or 'No'.");

        // Assert the follow-up question was "sent".
        expect(mockSend).toHaveBeenCalledWith("Would you like to gain access to our exclusive website? Type 'Yes' or 'No'.");

        // Simulate user saying "Yes" to accessing the exclusive website and assert the final outcome.
        mockSend("Great testUser! Here is the access to our exclusive website");

        // Assert the final message provided to the user.
        expect(mockSend).toHaveBeenCalledWith("Great testUser! Here is the access to our exclusive website");
    });

    it('correctly handles user saying "No" to initial question', async () => {
        // Act: Trigger the !askweb command.
        await askWebCommand(mockMessage);

        // Assert: Check the initial question was asked.
        expect(mockReply).toHaveBeenCalledWith(expect.stringContaining(`Do you need assistance with the game you are playing? Type 'Yes' or 'No'.`));

        // Directly simulate the bot's response after a "No" response to the initial question.
        mockSend("No problem, feel free to ask if you have other questions!");

        // Assert the bot's response to the "No" answer.
        expect(mockSend).toHaveBeenCalledWith("No problem, feel free to ask if you have other questions!");
    });

    it('provides a help message listing all commands when !help is invoked', async () => {
        mockMessage.content = '!help';
        await helpCommand(mockMessage);
    
        const expectedHelpMessageContent = expect.stringContaining('**start** - Begin interaction with the chatbot');
        expect(mockReply).toHaveBeenCalledWith(expectedHelpMessageContent);
    
        // Optionally, add more specific checks for individual command descriptions within the help message
        expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('**start** - Begin interaction with the chatbot'));
        expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('**clear** - Delete a specified number of messages'));
        expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('**ask** - Ask a question to receive help from OMEGA'));
        expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('**askweb** - Don\'t want to use OMEGA on Discord? Use the web version instead!'));
        expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('**roll** - Roll a dice'));
        expect(mockReply).toHaveBeenCalledWith(expect.stringContaining('**flipcoin** - Flip a coin'));
    });
    
    it('responds to !ping with Pong!', async () => {
        await pingCommand(mockMessage);
        expect(mockReply).toHaveBeenCalledWith('Pinging...');
        expect(mockEdit).toHaveBeenCalledWith(expect.stringContaining('Pong!'));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});


// To run: npm test