const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

const setupPassport = () => {
  // JWT Strategy
  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      (req) => req?.cookies?.token || req?.headers?.['x-access-token'],
    ]),
    secretOrKey: process.env.JWT_SECRET || 'clause_super_secure_jwt_secret_key_2026_production_grade',
  };

  passport.use(
    new JwtStrategy(jwtOpts, async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id);
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );

  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value?.toLowerCase();
            if (!email) return done(new Error('No email found from Google profile'), null);

            let user = await User.findOne({ email });
            if (!user) {
              user = await User.create({
                name: profile.displayName || email.split('@')[0],
                email,
                providers: [{ provider: 'google', providerId: profile.id }],
              });
            } else {
              const hasProvider = user.providers.some((p) => p.provider === 'google');
              if (!hasProvider) {
                user.providers.push({ provider: 'google', providerId: profile.id });
                await user.save();
              }
            }
            return done(null, user);
          } catch (err) {
            return done(err, null);
          }
        }
      )
    );
  }

  // GitHub Strategy
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback',
          scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value?.toLowerCase() || `${profile.username}@github.user`;
            let user = await User.findOne({ email });
            if (!user) {
              user = await User.create({
                name: profile.displayName || profile.username || 'GitHub User',
                email,
                providers: [{ provider: 'github', providerId: profile.id }],
              });
            } else {
              const hasProvider = user.providers.some((p) => p.provider === 'github');
              if (!hasProvider) {
                user.providers.push({ provider: 'github', providerId: profile.id });
                await user.save();
              }
            }
            return done(null, user);
          } catch (err) {
            return done(err, null);
          }
        }
      )
    );
  }

  // Facebook Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5000/api/auth/facebook/callback',
          profileFields: ['id', 'displayName', 'emails'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value?.toLowerCase() || `${profile.id}@facebook.user`;
            let user = await User.findOne({ email });
            if (!user) {
              user = await User.create({
                name: profile.displayName || 'Facebook User',
                email,
                providers: [{ provider: 'facebook', providerId: profile.id }],
              });
            } else {
              const hasProvider = user.providers.some((p) => p.provider === 'facebook');
              if (!hasProvider) {
                user.providers.push({ provider: 'facebook', providerId: profile.id });
                await user.save();
              }
            }
            return done(null, user);
          } catch (err) {
            return done(err, null);
          }
        }
      )
    );
  }
};

module.exports = setupPassport;
