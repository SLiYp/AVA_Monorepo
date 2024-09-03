const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.post('/', auth,chatController.createChatSession);
router.post('/:sessionId/prompt', chatController.addPrompt);
// router.post('/:sessionId/prompt/:promptId/response', chatController.addResponse);
router.put('/:sessionId/prompt/:promptId', chatController.modifyPrompt);
router.get('/:sessionId',auth,chatController.getChatSessionData)

module.exports = router;
