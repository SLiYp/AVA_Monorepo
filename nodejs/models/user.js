const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    chatSessions: [{
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChatSession',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', UserSchema);
