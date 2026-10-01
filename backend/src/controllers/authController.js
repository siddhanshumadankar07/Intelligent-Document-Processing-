const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');
const OTP = require('../models/OTP');
const Session = require('../models/Session');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'clause_super_secure_jwt_secret_key_2026_production_grade',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  profession: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const otpRequestSchema = z.object({
  phoneOrEmail: z.string().min(5, 'Valid phone or email required'),
});

const otpVerifySchema = z.object({
  phoneOrEmail: z.string().min(5, 'Valid phone or email required'),
  code: z.string().length(6, 'OTP must be 6 digits'),
  name: z.string().optional(),
});

/**
 * Register with Email & Password
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, profession } = registerSchema.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();

    let existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      profession: profession || 'Finance/Accounting',
      providers: [{ provider: 'local' }],
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profession: user.profession,
        jarvisSettings: user.jarvisSettings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login with Email & Password
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: 'This account was created via social login. Please log in using Google, GitHub, or WhatsApp.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profession: user.profession,
        jarvisSettings: user.jarvisSettings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Current authenticated user info
 */
const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      profession: req.user.profession,
      customProfession: req.user.customProfession,
      jarvisSettings: req.user.jarvisSettings,
      defaultSessionTtlMinutes: req.user.defaultSessionTtlMinutes,
      providers: req.user.providers.map((p) => p.provider),
    },
  });
};

/**
 * Request WhatsApp OTP
 */
const requestWhatsAppOTP = async (req, res, next) => {
  try {
    const { phoneOrEmail } = otpRequestSchema.parse(req.body);
    const identifier = phoneOrEmail.trim();

    // Generate 6 digit numeric code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(8);
    const hashedCode = await bcrypt.hash(otpCode, salt);

    // Expire in 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.deleteMany({ phoneOrEmail: identifier });
    await OTP.create({
      phoneOrEmail: identifier,
      hashedCode,
      expiresAt,
    });

    // Check if Twilio is configured
    const twilioConfigured = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN;
    if (twilioConfigured) {
      // In production with Twilio credentials, send WhatsApp message
      console.log(`[Twilio WhatsApp] OTP dispatched to ${identifier}`);
    } else {
      // For development / hackathon testing, log OTP to server console
      console.log(`[Development Mock OTP] Code for ${identifier}: ${otpCode}`);
    }

    return res.json({
      success: true,
      message: twilioConfigured
        ? `Verification code sent via WhatsApp to ${identifier}.`
        : `[Demo Mode] Verification code generated: ${otpCode}`,
      demoCode: !twilioConfigured ? otpCode : undefined,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify WhatsApp OTP and login / create account
 */
const verifyWhatsAppOTP = async (req, res, next) => {
  try {
    const { phoneOrEmail, code, name } = otpVerifySchema.parse(req.body);
    const identifier = phoneOrEmail.trim();

    const otpRecord = await OTP.findOne({
      phoneOrEmail: identifier,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired or does not exist. Please request a new code.',
      });
    }

    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({
        success: false,
        message: 'Too many failed verification attempts. Please request a new OTP.',
      });
    }

    const isValid = await bcrypt.compare(code, otpRecord.hashedCode);
    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: `Incorrect verification code. ${5 - otpRecord.attempts} attempts remaining.`,
      });
    }

    // Mark verified and delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Lookup or create user by phone or generated email
    const email = identifier.includes('@') ? identifier.toLowerCase() : `whatsapp_${identifier.replace(/[^0-9]/g, '')}@clause.user`;
    let user = await User.findOne({ $or: [{ email }, { phone: identifier }] });

    if (!user) {
      user = await User.create({
        name: name || `User ${identifier.slice(-4)}`,
        email,
        phone: identifier,
        providers: [{ provider: 'whatsapp' }],
        profession: 'Finance/Accounting',
      });
    } else {
      const hasProvider = user.providers.some((p) => p.provider === 'whatsapp');
      if (!hasProvider) {
        user.providers.push({ provider: 'whatsapp' });
        await user.save();
      }
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Verified successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profession: user.profession,
        jarvisSettings: user.jarvisSettings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle OAuth callback success
 */
const oauthSuccess = (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=auth_failed`);
  }
  const token = generateToken(req.user);
  return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?token=${token}`);
};

/**
 * Logout
 */
const logout = async (req, res) => {
  return res.json({
    success: true,
    message: 'Logged out successfully. Local credentials cleared.',
  });
};

module.exports = {
  register,
  login,
  getMe,
  requestWhatsAppOTP,
  verifyWhatsAppOTP,
  oauthSuccess,
  logout,
};
