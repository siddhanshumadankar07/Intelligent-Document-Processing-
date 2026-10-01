const express = require('express');
const chatController = require('../controllers/chatController');
const { requireAuth } = require('../middleware/auth');
const { requireActiveSession } = require('../middleware/session');

const router = express.Router();

router.use(requireAuth);
router.use(requireActiveSession);

router.post('/message', chatController.sendMessage);
router.get('/history', chatController.getChatHistory);
router.delete('/history', chatController.clearChatHistory);

module.exports = router;
