const Session = require('../models/Session');
const Document = require('../models/Document');
const ChatMessage = require('../models/ChatMessage');
const { generateSessionExportPDF } = require('../services/pdfService');

/**
 * Generate comprehensive session PDF and stream it to the user.
 * Optional wipe parameter: when wipe=true, automatically purges the session data once the PDF finishes streaming.
 */
const exportSessionPDF = async (req, res, next) => {
  try {
    const session = req.sessionDoc;
    const user = req.user;
    const shouldWipe = req.query.wipe === 'true';

    // 1. Gather all session data
    const documents = await Document.find({ sessionId: session._id });
    const chatMessages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 });

    const totalDocs = documents.length;
    const avgConfidence = totalDocs > 0
      ? Math.round(documents.reduce((sum, d) => sum + (d.confidence || 0), 0) / totalDocs)
      : 100;

    // 2. Generate PDF Buffer
    const pdfBuffer = await generateSessionExportPDF({
      session,
      user,
      documents,
      chatMessages,
      insights: {
        totalDocs,
        avgConfidence,
      },
    });

    // 3. Set headers for file download
    const filename = `Clause_Session_${new Date().toISOString().slice(0, 10)}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // 4. Send PDF Buffer
    res.end(pdfBuffer, async () => {
      // If wipe was requested (End Session flow), permanently delete everything AFTER delivery
      if (shouldWipe) {
        try {
          await Document.deleteMany({ sessionId: session._id });
          await ChatMessage.deleteMany({ sessionId: session._id });
          session.status = 'ended';
          session.endedAt = new Date();
          await session.save();
          await Session.deleteOne({ _id: session._id });
          console.log(`[Zero-Retention Export] Session ${session._id} successfully delivered PDF and hard-deleted from database.`);
        } catch (purgeErr) {
          console.error(`[Zero-Retention Export Error] Failed to purge session after PDF delivery: ${purgeErr.message}`);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportSessionPDF,
};
