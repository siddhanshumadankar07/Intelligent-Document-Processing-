const ChatMessage = require('../models/ChatMessage');
const Document = require('../models/Document');
const { askJarvisAI } = require('../services/aiService');

/**
 * Send message to Jarvis (supports regular JSON & SSE streaming)
 */
const sendMessage = async (req, res, next) => {
  try {
    const { message, stream = false } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required.',
      });
    }

    const session = req.sessionDoc;
    const userId = req.user._id;

    // 1. Fetch user-scoped documents in current session
    const documents = await Document.find({ sessionId: session._id });

    // 2. Fetch recent conversation history
    const history = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 }).limit(10);

    // 3. Save User Message
    const userMsg = await ChatMessage.create({
      sessionId: session._id,
      userId,
      role: 'user',
      content: message.trim(),
    });

    // 4. Generate AI response scoped ONLY to session documents
    const aiResponse = await askJarvisAI({
      question: message.trim(),
      documents,
      chatHistory: history,
      userSettings: req.user.jarvisSettings || {},
      userProfession: req.user.profession || 'Finance/Accounting',
    });

    // 5. Detect and structure any action command
    let actionExecuted = null;
    const lowerQ = message.toLowerCase();
    if (lowerQ.includes('unapproved') || lowerQ.includes('needs review')) {
      actionExecuted = {
        action: 'filter_unapproved',
        details: { count: documents.filter((d) => d.status === 'Needs Review').length },
        status: 'completed',
      };
    } else if (lowerQ.includes('delete') && lowerQ.includes('document')) {
      actionExecuted = {
        action: 'delete_documents_request',
        details: { prompt: 'Do you want me to delete the selected documents from this session?' },
        status: 'pending_confirmation',
      };
    } else if (lowerQ.includes('export')) {
      actionExecuted = {
        action: 'trigger_export',
        details: { url: '/api/export' },
        status: 'completed',
      };
    }

    // 6. Save Assistant Message
    const assistantMsg = await ChatMessage.create({
      sessionId: session._id,
      userId,
      role: 'assistant',
      content: aiResponse.reply,
      citations: aiResponse.citations || [],
      actionExecuted,
    });

    if (stream) {
      // Server-Sent Events (SSE) streaming output
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const words = aiResponse.reply.split(' ');
      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? '' : ' ') + words[i];
        res.write(`data: ${JSON.stringify({ token: chunk, done: false })}\n\n`);
        await new Promise((resolve) => setTimeout(resolve, 25)); // Smooth token cadence
      }

      res.write(`data: ${JSON.stringify({
        token: '',
        done: true,
        messageId: assistantMsg._id,
        citations: aiResponse.citations,
        actionExecuted,
      })}\n\n`);
      return res.end();
    }

    return res.json({
      success: true,
      message: {
        id: assistantMsg._id,
        role: assistantMsg.role,
        content: assistantMsg.content,
        citations: assistantMsg.citations,
        actionExecuted: assistantMsg.actionExecuted,
        createdAt: assistantMsg.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get chat history for the active session
 */
const getChatHistory = async (req, res, next) => {
  try {
    const session = req.sessionDoc;
    const messages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 });

    return res.json({
      success: true,
      count: messages.length,
      messages: messages.map((m) => ({
        id: m._id,
        role: m.role,
        content: m.content,
        citations: m.citations,
        actionExecuted: m.actionExecuted,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear chat history within session
 */
const clearChatHistory = async (req, res, next) => {
  try {
    const session = req.sessionDoc;
    await ChatMessage.deleteMany({ sessionId: session._id });

    return res.json({
      success: true,
      message: 'Chat history cleared for this session.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  clearChatHistory,
};
