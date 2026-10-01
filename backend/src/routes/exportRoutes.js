const express = require('express');
const exportController = require('../controllers/exportController');
const { requireAuth } = require('../middleware/auth');
const { requireActiveSession } = require('../middleware/session');

const router = express.Router();

router.use(requireAuth);
router.use(requireActiveSession);

// Session PDF export and automatic post-delivery zero-retention wipe
router.get('/', exportController.exportSessionPDF);

module.exports = router;
