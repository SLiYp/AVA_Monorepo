const mongoose = require('mongoose');

const ChatSessionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    prompts: [{
        promptId: {
            type: String,
            required: true,
        },
        prompt: {
            type: String,
            required: true,
        },
        responses: [{
            type: String,
            required: true,
        }],
        createdAt: {
        type: Date,
        default: Date.now,
    }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
