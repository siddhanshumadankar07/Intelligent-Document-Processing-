const express = require('express');
const sessionController = require('../controllers/sessionController');
const { requireAuth } = require('../middleware/auth');
const { requireActiveSession } = require('../middleware/session');

const router = express.Router();

router.use(requireAuth);

router.post('/start', sessionController.startSession);
router.post('/extend', requireActiveSession, sessionController.extendSession);
router.get('/status', requireActiveSession, sessionController.getSessionStatus);
router.post('/end', requireActiveSession, sessionController.endSession);

module.exports = router;
