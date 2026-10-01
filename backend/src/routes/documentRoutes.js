const express = require('express');
const documentController = require('../controllers/documentController');
const { requireAuth } = require('../middleware/auth');
const { requireActiveSession } = require('../middleware/session');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(requireAuth);
router.use(requireActiveSession);

router.post('/upload', upload.array('documents', 10), documentController.uploadAndProcessDocuments);
router.get('/', documentController.listDocuments);
router.get('/:id', documentController.getDocument);
router.put('/:id', documentController.updateDocumentFields);
router.patch('/:id/status', documentController.updateDocumentStatus);
router.post('/:id/reprocess', documentController.reprocessDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
