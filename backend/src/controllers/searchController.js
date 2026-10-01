const Document = require('../models/Document');

/**
 * Session-scoped search across extracted data, summaries, filenames, and text
 * Used by the Search page & Jarvis backend search tool
 */
const searchDocuments = async (req, res, next) => {
  try {
    const session = req.sessionDoc;
    const { q, type, status, category, minConfidence, maxConfidence } = req.query;

    const queryFilter = { sessionId: session._id };

    if (type && type !== 'all') {
      queryFilter.type = type;
    }

    if (status && status !== 'all') {
      queryFilter.status = status;
    }

    if (category && category !== 'all') {
      queryFilter.category = category;
    }

    if (minConfidence || maxConfidence) {
      queryFilter.confidence = {};
      if (minConfidence) queryFilter.confidence.$gte = Number(minConfidence);
      if (maxConfidence) queryFilter.confidence.$lte = Number(maxConfidence);
    }

    const documents = await Document.find(queryFilter).sort({ createdAt: -1 });

    const searchKeyword = (q || '').trim().toLowerCase();

    const results = documents
      .filter((doc) => {
        if (!searchKeyword) return true;
        const nameMatch = doc.fileName.toLowerCase().includes(searchKeyword);
        const summaryMatch = (doc.summary || '').toLowerCase().includes(searchKeyword);
        const textMatch = (doc.extractedText || '').toLowerCase().includes(searchKeyword);
        const typeMatch = (doc.type || '').toLowerCase().includes(searchKeyword);
        
        let dataMatch = false;
        if (doc.extractedData) {
          const values = Array.from(doc.extractedData.values()).map((v) => String(v).toLowerCase());
          dataMatch = values.some((val) => val.includes(searchKeyword));
        }

        return nameMatch || summaryMatch || textMatch || typeMatch || dataMatch;
      })
      .map((doc) => {
        // Find best snippet with context
        let matchedSnippet = doc.summary;
        if (searchKeyword && doc.extractedText) {
          const idx = doc.extractedText.toLowerCase().indexOf(searchKeyword);
          if (idx !== -1) {
            const start = Math.max(0, idx - 60);
            const end = Math.min(doc.extractedText.length, idx + searchKeyword.length + 60);
            matchedSnippet = '...' + doc.extractedText.slice(start, end).replace(/\n/g, ' ') + '...';
          }
        }

        return {
          id: doc._id,
          fileName: doc.fileName,
          type: doc.type,
          category: doc.category,
          status: doc.status,
          confidence: doc.confidence,
          summary: doc.summary,
          matchedSnippet,
          flags: doc.flags,
          createdAt: doc.createdAt,
        };
      });

    return res.json({
      success: true,
      query: searchKeyword,
      count: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchDocuments,
};
