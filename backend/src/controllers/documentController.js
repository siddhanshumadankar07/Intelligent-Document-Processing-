const Document = require('../models/Document');
const { extractTextFromBuffer } = require('../services/ocrService');
const { processDocumentWithAI } = require('../services/aiService');

/**
 * Convert a plain JS object → Mongoose-compatible Map
 * Arrays and nested objects are JSON-stringified for safe Map storage.
 */
const toMongooseMap = (obj) => {
  const map = new Map();
  for (const [k, v] of Object.entries(obj || {})) {
    map.set(k, typeof v === 'object' && v !== null ? JSON.stringify(v) : v);
  }
  return map;
};

/**
 * Deserialize a Mongoose Map back to a plain JS object.
 * Reverses JSON-stringified arrays and objects.
 */
const fromMongooseMap = (map) => {
  const out = {};
  for (const [k, v] of (map || new Map())) {
    try {
      out[k] =
        typeof v === 'string' && (v.startsWith('[') || v.startsWith('{'))
          ? JSON.parse(v)
          : v;
    } catch (_) {
      out[k] = v;
    }
  }
  return out;
};

/**
 * Upload and process files in memory.
 * Buffers are wiped immediately after extraction to maintain zero-retention guarantee.
 * Each file is processed independently — one failure won't abort the whole batch.
 */
const uploadAndProcessDocuments = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded. Please select one or more documents.',
      });
    }

    const session = req.sessionDoc;
    const userId = req.user._id;
    const userProfession = req.user.profession || 'Finance/Accounting';
    const processedResults = [];

    // Fetch existing session docs once for duplicate detection
    const existingDocs = await Document.find({ sessionId: session._id });

    for (const file of req.files) {
      const startTime = Date.now();
      const originalName = file.originalname;
      const mimeType = file.mimetype;
      const fileSize = file.size;

      try {
        // STEP 1 — Text Extraction & OCR
        const extraction = await extractTextFromBuffer(file.buffer, mimeType, originalName);
        file.buffer = null; // Zero-retention: release buffer immediately

        // STEP 2 — AI classification, field extraction, validation, confidence scoring
        const aiResult = await processDocumentWithAI({
          fileName: originalName,
          extractedText: extraction.text,
          userProfession,
        });

        // STEP 3 — Duplicate detection
        const isDuplicate = existingDocs.some(
          (ed) =>
            ed.fileName === originalName ||
            (ed.extractedText &&
              ed.extractedText.slice(0, 100) === extraction.text.slice(0, 100))
        );

        if (isDuplicate) {
          aiResult.flags.push({
            type: 'warning',
            field: 'fileName',
            message: 'Potential duplicate document detected',
            explanation: 'A document with the same name or content already exists in this session.',
          });
          aiResult.status = 'Needs Review';
        }

        const processingTimeMs = Date.now() - startTime;

        // STEP 4 — Persist to MongoDB
        // Mongoose Map fields require Map instances; arrays/objects inside extractedData
        // are JSON-serialized so they survive Map round-tripping correctly.
        const doc = await Document.create({
          sessionId: session._id,
          userId,
          fileName: originalName,
          fileSize,
          mimeType,
          pageCount: extraction.pageCount,
          type: aiResult.documentType,
          category: aiResult.category,
          extractedData: toMongooseMap(aiResult.extractedData),
          fieldConfidences: new Map(Object.entries(aiResult.fieldConfidences || {})),
          summary: aiResult.summary,
          extractedText: extraction.text, // Private; purged with session
          confidence: aiResult.confidence,
          flags: aiResult.flags,
          status: aiResult.status,
          processingTimeMs,
        });

        // STEP 5 — Build response with deserialized fields
        processedResults.push({
          id: doc._id,
          fileName: doc.fileName,
          fileSize: doc.fileSize,
          mimeType: doc.mimeType,
          pageCount: doc.pageCount,
          type: doc.type,
          category: doc.category,
          extractedData: fromMongooseMap(doc.extractedData),
          fieldConfidences: Object.fromEntries(doc.fieldConfidences || new Map()),
          summary: doc.summary,
          extractedText: doc.extractedText,
          confidence: doc.confidence,
          flags: doc.flags,
          status: doc.status,
          processingTimeMs: doc.processingTimeMs,
          ocrUsed: extraction.ocrUsed,
          extractionSuccess: extraction.charCount > 0 && !extraction.text.startsWith('[Document Content:'),
        });
      } catch (fileErr) {
        // Log the full error but continue processing remaining files
        console.error(
          `[Document Upload] Error processing "${originalName}": ${fileErr.message}\n${fileErr.stack}`
        );
        processedResults.push({
          fileName: originalName,
          error: `Failed to process file: ${fileErr.message}`,
          status: 'Rejected',
          confidence: 0,
          flags: [
            {
              type: 'error',
              field: 'file',
              message: 'Processing failed',
              explanation: fileErr.message,
            },
          ],
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: `Successfully processed ${processedResults.length} document(s). Raw memory buffers cleared.`,
      documents: processedResults,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all documents in current active session
 */
const listDocuments = async (req, res, next) => {
  try {
    const session = req.sessionDoc;
    const documents = await Document.find({ sessionId: session._id }).sort({ createdAt: -1 });

    const formatted = documents.map((d) => ({
      id: d._id,
      fileName: d.fileName,
      fileSize: d.fileSize,
      mimeType: d.mimeType,
      pageCount: d.pageCount,
      type: d.type,
      category: d.category,
      extractedData: fromMongooseMap(d.extractedData),
      fieldConfidences: Object.fromEntries(d.fieldConfidences || new Map()),
      summary: d.summary,
      extractedText: d.extractedText,
      confidence: d.confidence,
      flags: d.flags,
      status: d.status,
      processingTimeMs: d.processingTimeMs,
      createdAt: d.createdAt,
      extractionSuccess: !!(d.extractedText && d.extractedText.length > 0 && !d.extractedText.startsWith('[Document Content:')),
    }));

    return res.json({
      success: true,
      count: formatted.length,
      documents: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single document details
 */
const getDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Document.findOne({ _id: id, sessionId: req.sessionDoc._id });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found in current session.',
      });
    }

    return res.json({
      success: true,
      document: {
        id: doc._id,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        pageCount: doc.pageCount,
        type: doc.type,
        category: doc.category,
        extractedData: fromMongooseMap(doc.extractedData),
        fieldConfidences: Object.fromEntries(doc.fieldConfidences || new Map()),
        summary: doc.summary,
        extractedText: doc.extractedText,
        confidence: doc.confidence,
        flags: doc.flags,
        status: doc.status,
        processingTimeMs: doc.processingTimeMs,
        createdAt: doc.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update document extracted fields (Human-in-the-loop review)
 */
const updateDocumentFields = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { extractedData, summary, status } = req.body;

    const doc = await Document.findOne({ _id: id, sessionId: req.sessionDoc._id });
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found in current session.',
      });
    }

    if (extractedData) {
      doc.extractedData = toMongooseMap(extractedData);
    }
    if (summary) {
      doc.summary = summary;
    }
    if (status) {
      doc.status = status;
    }

    // Boost confidence after human review
    doc.confidence = Math.min(100, Math.max(doc.confidence, 98));
    await doc.save();

    return res.json({
      success: true,
      message: 'Document updated successfully.',
      document: {
        id: doc._id,
        fileName: doc.fileName,
        extractedData: fromMongooseMap(doc.extractedData),
        summary: doc.summary,
        confidence: doc.confidence,
        status: doc.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update document status (Approved, Needs Review, Rejected)
 */
const updateDocumentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Needs Review', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Approved, Needs Review, or Rejected.',
      });
    }

    const doc = await Document.findOne({ _id: id, sessionId: req.sessionDoc._id });
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found in current session.',
      });
    }

    doc.status = status;
    await doc.save();

    return res.json({
      success: true,
      message: `Document marked as ${status}.`,
      status: doc.status,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reprocess document through AI pipeline
 */
const reprocessDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Document.findOne({ _id: id, sessionId: req.sessionDoc._id });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found in current session.',
      });
    }

    const aiResult = await processDocumentWithAI({
      fileName: doc.fileName,
      extractedText: doc.extractedText || '',
      userProfession: req.user.profession || 'Finance/Accounting',
    });

    doc.type = aiResult.documentType;
    doc.category = aiResult.category;
    doc.extractedData = toMongooseMap(aiResult.extractedData);
    doc.fieldConfidences = new Map(Object.entries(aiResult.fieldConfidences || {}));
    doc.summary = aiResult.summary;
    doc.confidence = aiResult.confidence;
    doc.flags = aiResult.flags;
    doc.status = aiResult.status;

    await doc.save();

    return res.json({
      success: true,
      message: 'Document reprocessed successfully.',
      document: {
        id: doc._id,
        fileName: doc.fileName,
        type: doc.type,
        category: doc.category,
        extractedData: fromMongooseMap(doc.extractedData),
        summary: doc.summary,
        confidence: doc.confidence,
        flags: doc.flags,
        status: doc.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete single document from session
 */
const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Document.deleteOne({ _id: id, sessionId: req.sessionDoc._id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or already deleted.',
      });
    }

    return res.json({
      success: true,
      message: 'Document deleted from session.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAndProcessDocuments,
  listDocuments,
  getDocument,
  updateDocumentFields,
  updateDocumentStatus,
  reprocessDocument,
  deleteDocument,
};
