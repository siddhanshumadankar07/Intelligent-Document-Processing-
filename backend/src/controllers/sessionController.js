const Session = require('../models/Session');
const Document = require('../models/Document');
const ChatMessage = require('../models/ChatMessage');

/**
 * Start or retrieve an active session
 */
const startSession = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const ttlMinutes = req.user.defaultSessionTtlMinutes || 15;
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    // End any old active sessions
    await Session.updateMany(
      { userId, status: 'active' },
      { status: 'ended', endedAt: new Date() }
    );

    const session = await Session.create({
      userId,
      expiresAt,
      status: 'active',
    });

    return res.status(201).json({
      success: true,
      message: 'New private session initialized.',
      session: {
        id: session._id,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        status: session.status,
        ttlMinutes,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Extend active session TTL
 */
const extendSession = async (req, res, next) => {
  try {
    const session = req.sessionDoc;
    const minutesToAdd = Number(req.body.minutes) || 15;

    // Cap max extension to 120 minutes from now
    const currentExpiry = new Date(session.expiresAt).getTime();
    const newExpiry = new Date(Math.max(Date.now(), currentExpiry) + minutesToAdd * 60 * 1000);

    session.expiresAt = newExpiry;
    await session.save();

    return res.json({
      success: true,
      message: `Session extended by ${minutesToAdd} minutes.`,
      session: {
        id: session._id,
        expiresAt: session.expiresAt,
        status: session.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get active session status and remaining seconds
 */
const getSessionStatus = async (req, res, next) => {
  try {
    const session = req.sessionDoc;
    const now = Date.now();
    const expiry = new Date(session.expiresAt).getTime();
    const remainingSeconds = Math.max(0, Math.floor((expiry - now) / 1000));

    // Get count of items currently in memory
    const documentCount = await Document.countDocuments({ sessionId: session._id });
    const chatCount = await ChatMessage.countDocuments({ sessionId: session._id });

    return res.json({
      success: true,
      session: {
        id: session._id,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        status: session.status,
        remainingSeconds,
        isExpired: remainingSeconds <= 0,
        stats: {
          documentCount,
          chatCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * End session manually and permanently purge all documents & chats
 */
const endSession = async (req, res, next) => {
  try {
    const session = req.sessionDoc;
    const sessionId = session._id;

    // Purge associated documents
    const deletedDocs = await Document.deleteMany({ sessionId });
    // Purge associated chat messages
    const deletedChats = await ChatMessage.deleteMany({ sessionId });
    // Mark session ended & delete
    session.status = 'ended';
    session.endedAt = new Date();
    await session.save();
    await Session.deleteOne({ _id: sessionId });

    return res.json({
      success: true,
      message: 'Session closed. All document buffers, structured records, and chat transcripts permanently expunged.',
      purged: {
        documentsDeleted: deletedDocs.deletedCount,
        chatsDeleted: deletedChats.deletedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startSession,
  extendSession,
  getSessionStatus,
  endSession,
};
