const User = require('../models/user');
const {encrypt,decrypt} = require('../utils/crypto-utils');
exports.getUserInfo = async (req, res) => {
    try {
        // console.log(req.user)
        const user = await User.findById(req.user.id).select('-password -_id');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // Decrypt the name and image of each chat session
        user.chatSessions.forEach(session => {
            session.name = decrypt(session.name);
            session.image = decrypt(session.image);
        });
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
