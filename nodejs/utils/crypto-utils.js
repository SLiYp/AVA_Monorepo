// crypto-utils.js
const crypto = require('crypto');

// Use a single secret key across your application
const secretKey = Buffer.from(process.env.CRYPTO_SECRET_KEY||'a3c4b9e3f6a1b4c2d6e7f1b3a8d9c4e6f7b2c9a1d4e3b6a8c1d7e9f3a4b6c2d9', 'hex')
const algorithm = 'aes-256-cbc';

// Function to encrypt data
exports.encrypt = (text) => {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return JSON.stringify({ iv: iv.toString('hex'), encryptedData: encrypted });
    } catch (err) {
        console.error('Encryption error:', err);
        throw new Error('Encryption failed');
    }
}

// Function to decrypt data
exports.decrypt = (data) => {
    try {
        const { encryptedData, iv } = JSON.parse(data);
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        console.error('Decryption error:', err);
        throw new Error('Decryption failed');
    }
}
