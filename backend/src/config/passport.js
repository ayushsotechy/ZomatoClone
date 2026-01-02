const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model"); // <--- Check this path matches your User model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
      proxy: true, // Required for Nginx/Live server
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user exists based on email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Optional: Save googleId if they logged in with email before
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // 2. If no user, create one
        user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          // No password needed for Google users
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;