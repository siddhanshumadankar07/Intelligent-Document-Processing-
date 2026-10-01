const Session = require('../models/Session');

const requireActiveSession = async (req, res, next) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId || req.body.sessionId;
    const userId = req.user._id;

    let session = null;
    if (sessionId) {
      session = await Session.findOne({
        _id: sessionId,
        userId,
        status: 'active',
        expiresAt: { $gt: new Date() },
      });
    }

    // If no sessionId provided or expired, auto-lookup latest active session for this user
    if (!session) {
      session = await Session.findOne({
        userId,
        status: 'active',
        expiresAt: { $gt: new Date() },
      }).sort({ createdAt: -1 });
    }

    // If still no session, create one with user's default TTL
    if (!session) {
      const ttlMinutes = req.user.defaultSessionTtlMinutes || 15;
      const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
      session = await Session.create({
        userId,
        expiresAt,
        status: 'active',
      });
    }

    req.sessionDoc = session;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to resolve active privacy session.',
    });
  }
};

module.exports = { requireActiveSession };
