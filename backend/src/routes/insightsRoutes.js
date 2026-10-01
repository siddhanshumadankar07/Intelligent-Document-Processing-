const express = require('express');
const insightsController = require('../controllers/insightsController');
const { requireAuth } = require('../middleware/auth');
const { requireActiveSession } = require('../middleware/session');

const router = express.Router();

router.use(requireAuth);
router.use(requireActiveSession);

router.get('/dashboard', insightsController.getDashboardInsights);

module.exports = router;
