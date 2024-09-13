const ChatSession = require("../models/ChatSession");
const User = require("../models/user");
const { promptResponse } = require("../services/chatService");
const { encrypt, decrypt } = require("../utils/crypto-utils");

exports.createChatSession = async (req, res) => {
    const userId = req.user.id;
    const { name, image } = req.body;

    try {
        const newChatSession = new ChatSession({
            name: encrypt(name),
            user: userId,
            image: encrypt(image),
        });
        const chatSession = await newChatSession.save();

        // Update user to include this chat session
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        user.chatSessions.push({
            name: encrypt(name),
            image: encrypt(image),
            sessionId: chatSession.id,
        });
        await user.save();

        res.json({ chatSessionId: chatSession._id, name, image });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

exports.addPrompt = async (req, res) => {
    const { sessionId } = req.params;
    const { promptId, prompt } = req.body;

    try {
        const chatSession = await ChatSession.findById(sessionId);

        // Check if the prompt already exists in the session
        const existingPrompt = chatSession.prompts.find(
            (p) => p.promptId === promptId
        );

        const responsesOut = await addResponse(sessionId, promptId, prompt);

        if (existingPrompt) {
            // If the prompt exists, just push the response
            existingPrompt.responses.push(encrypt(responsesOut[0]));
        } else {
            // If the prompt doesn't exist, create a new prompt with the response
            chatSession.prompts.push({
                promptId,
                prompt: encrypt(prompt),
                responses: [encrypt(responsesOut[0])],
            });
        }

        await chatSession.save();

        res.json({ responses: responsesOut });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

const addResponse = async (sessionId, promptId, prompt) => {
    try {
        const msgData = {
            _id: sessionId,
            prompt_details: {
                promptId: promptId,
                prompt: prompt,
            },
        };
        let responses = await promptResponse(msgData);
        return responses;
    } catch (err) {
        console.error(err.message);
    }
};

exports.modifyPrompt = async (req, res) => {
    const { sessionId, promptId } = req.params;
    const { prompt } = req.body;

    try {
        const chatSession = await ChatSession.findById(sessionId);
        const promptToModify = chatSession.prompts.find(
            (p) => p.promptId === promptId
        );
        if (!promptToModify) {
            return res.status(404).json({ msg: "Prompt not found" });
        }
        promptToModify.prompt = encrypt(prompt);
        await chatSession.save();
        res.json({ msg: "Prompt modified" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

exports.getChatSessionData = async (req, res) => {
    try {
        const chatSessionId = req.params.sessionId;

        // Find the chat session by its ID
        const chatSession = await ChatSession.findById(chatSessionId)
            .populate("prompts.responses") //populates the responses instead of ids
            .populate("prompts");

        chatSession.name = decrypt(chatSession.name);
        chatSession.image = decrypt(chatSession.image);

        // Decrypting each prompt and its responses
        chatSession.prompts.forEach((prompt) => {
            prompt.prompt = decrypt(prompt.prompt); // Decrypt the prompt
            prompt.responses = prompt.responses.map((response) =>
                decrypt(response)
            ); // Decrypt each response
        });

        if (!chatSession) {
            return res.status(404).json({ msg: "Chat session not found" });
        }

        res.json(chatSession);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
