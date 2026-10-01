const express = require('express');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for auth and OTP routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many authentication attempts. Please wait a few minutes.' },
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many OTP requests. Please wait a few minutes.' },
});

// Local Auth
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getMe);

// WhatsApp OTP
router.post('/whatsapp/request-otp', otpLimiter, authController.requestWhatsAppOTP);
router.post('/whatsapp/verify-otp', otpLimiter, authController.verifyWhatsAppOTP);

// Google OAuth
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(501).json({ success: false, message: 'Google OAuth is not configured in .env.' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_failed' }), authController.oauthSuccess);

// GitHub OAuth
router.get('/github', (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID) {
    return res.status(501).json({ success: false, message: 'GitHub OAuth is not configured in .env.' });
  }
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login?error=github_failed' }), authController.oauthSuccess);

// Facebook OAuth
router.get('/facebook', (req, res, next) => {
  if (!process.env.FACEBOOK_APP_ID) {
    return res.status(501).json({ success: false, message: 'Facebook OAuth is not configured in .env.' });
  }
  passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
});
router.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: '/login?error=facebook_failed' }), authController.oauthSuccess);

module.exports = router;
