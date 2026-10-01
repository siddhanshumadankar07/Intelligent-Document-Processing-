const express = require('express');
const searchController = require('../controllers/searchController');
const { requireAuth } = require('../middleware/auth');
const { requireActiveSession } = require('../middleware/session');

const router = express.Router();

router.use(requireAuth);
router.use(requireActiveSession);

// Search endpoint used by Search page and Jarvis search tool
router.get('/', searchController.searchDocuments);

module.exports = router;
