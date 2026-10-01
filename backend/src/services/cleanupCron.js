const cron = require('node-cron');
const Session = require('../models/Session');
const Document = require('../models/Document');
const ChatMessage = require('../models/ChatMessage');
const OTP = require('../models/OTP');

/**
 * Initializes cron jobs for hard-deleting expired sessions and transient OTP records
 */
const initCleanupCron = () => {
  // Run every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    try {
      const now = new Date();
      
      // Find all expired or ended sessions
      const expiredSessions = await Session.find({
        $or: [
          { expiresAt: { $lt: now } },
          { status: 'ended' }
        ]
      }).select('_id');

      if (expiredSessions.length > 0) {
        const sessionIds = expiredSessions.map((s) => s._id);

        // Delete associated documents
        const deletedDocs = await Document.deleteMany({ sessionId: { $in: sessionIds } });
        // Delete associated chat messages
        const deletedChats = await ChatMessage.deleteMany({ sessionId: { $in: sessionIds } });
        // Hard-delete the session records
        const deletedSessions = await Session.deleteMany({ _id: { $in: sessionIds } });

        console.log(`[Zero-Retention Cron] Purged ${deletedSessions.deletedCount} expired session(s), ${deletedDocs.deletedCount} document(s), and ${deletedChats.deletedCount} chat message(s).`);
      }

      // Purge expired OTPs
      await OTP.deleteMany({ expiresAt: { $lt: now } });
    } catch (error) {
      console.error(`[Zero-Retention Cron Error] Cleanup run encountered: ${error.message}`);
    }
  });

  console.log('[Zero-Retention Cron] Cleanup scheduler initialized (Interval: 2 minutes).');
};

module.exports = { initCleanupCron };
