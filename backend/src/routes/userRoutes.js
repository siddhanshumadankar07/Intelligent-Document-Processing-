const express = require('express');
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.put('/profile', userController.updateProfile);
router.put('/profession', userController.updateProfession);
router.put('/jarvis-settings', userController.updateJarvisSettings);
router.put('/session-settings', userController.updateSessionSettings);
router.delete('/delete-account', userController.deleteAccount);

module.exports = router;
