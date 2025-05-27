const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/Users');
const newLocal = '../models/UserProfile';
const UserProfile = require(newLocal);
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SECRET_KEY = process.env.JWT_SECRET;

passport.use(new GoogleStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: '/api/v1/auth/google/callback',
  scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, cb) => {
  try {
    const user = await User.findOne({ where: { googleId: profile.id } });
    if (!user) {
      const newUser = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.displayName.split(' ')[0],
        lastName: profile.displayName.split(' ')[1],
        authProvider: 'google',
        emailVerified: true,
        accountStatus: 'active'
      });

      const createUserProfile = await UserProfile.create({
        userId: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      })
      const token = jwt.sign({ id: newUser.id }, SECRET_KEY, { expiresIn: '3600mins' });
      return cb(null, { user: newUser, token });
    } else {
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '3600mins' });
      return cb(null, { user, token });
    }
  } catch (err) {
    return cb(err);
  }
}));