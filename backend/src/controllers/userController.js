const User = require('../models/User');
const Session = require('../models/Session');
const Document = require('../models/Document');
const ChatMessage = require('../models/ChatMessage');
const { PROFESSION_DEFAULTS } = require('../config/schemas');

/**
 * Update user basic profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone ? phone.trim() : null;

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profession: user.profession,
        jarvisSettings: user.jarvisSettings,
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profession onboarding
 */
const updateProfession = async (req, res, next) => {
  try {
    const { profession, customProfession } = req.body;
    const user = await User.findById(req.user._id);

    if (profession) user.profession = profession;
    if (customProfession !== undefined) user.customProfession = customProfession;

    await user.save();

    const defaults = PROFESSION_DEFAULTS[user.profession] || PROFESSION_DEFAULTS['Other'];

    return res.json({
      success: true,
      message: 'Profession preferences updated.',
      profession: user.profession,
      customProfession: user.customProfession,
      suggestedPrompts: defaults.suggestedPrompts,
      primarySchemas: defaults.primarySchemas,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Jarvis configuration & customization
 */
const updateJarvisSettings = async (req, res, next) => {
  try {
    const { name, tone, voice, speakingSpeed, replyLanguage, avatar, themeColor, responseLength, autoSpeak } = req.body;
    const user = await User.findById(req.user._id);

    user.jarvisSettings = {
      name: name || user.jarvisSettings?.name || 'Jarvis',
      tone: tone || user.jarvisSettings?.tone || 'friendly',
      voice: voice || user.jarvisSettings?.voice || 'en-US',
      speakingSpeed: speakingSpeed !== undefined ? Number(speakingSpeed) : (user.jarvisSettings?.speakingSpeed || 1.0),
      replyLanguage: replyLanguage || user.jarvisSettings?.replyLanguage || 'en-US',
      avatar: avatar || user.jarvisSettings?.avatar || 'bot-violet',
      themeColor: themeColor || user.jarvisSettings?.themeColor || '#7C3AED',
      responseLength: responseLength || user.jarvisSettings?.responseLength || 'balanced',
      autoSpeak: autoSpeak !== undefined ? Boolean(autoSpeak) : (user.jarvisSettings?.autoSpeak || false),
    };

    await user.save();

    return res.json({
      success: true,
      message: 'Jarvis settings updated successfully.',
      jarvisSettings: user.jarvisSettings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update default session TTL
 */
const updateSessionSettings = async (req, res, next) => {
  try {
    const { defaultSessionTtlMinutes } = req.body;
    const user = await User.findById(req.user._id);

    if (defaultSessionTtlMinutes && defaultSessionTtlMinutes >= 5 && defaultSessionTtlMinutes <= 120) {
      user.defaultSessionTtlMinutes = Number(defaultSessionTtlMinutes);
      await user.save();
    }

    return res.json({
      success: true,
      message: 'Session preferences updated.',
      defaultSessionTtlMinutes: user.defaultSessionTtlMinutes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete account and purge ALL data across sessions, documents, and chats permanently
 */
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Purge documents
    await Document.deleteMany({ userId });
    // Purge chat messages
    await ChatMessage.deleteMany({ userId });
    // Purge sessions
    await Session.deleteMany({ userId });
    // Purge user record
    await User.findByIdAndDelete(userId);

    return res.json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  updateProfession,
  updateJarvisSettings,
  updateSessionSettings,
  deleteAccount,
};
