const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model"); 
const FoodPartner = require("../models/foodpartner.model"); // ✅ Import Partner Model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
      proxy: true, 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 1. Check if this email belongs to a PARTNER
        let partner = await FoodPartner.findOne({ email: email });
        
        if (partner) {
          // It's a Partner! Return them.
          // (We attach a custom flag so we know it's a partner later if needed)
          partner.role = "partner"; 
          return done(null, partner);
        }

        // 2. If not a Partner, check if it's a USER
        let user = await User.findOne({ email: email });

        if (user) {
          // User exists
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          user.role = "user";
          return done(null, user);
        }

        // 3. If neither, create a new USER (Default behavior)
        // (Partners must register manually first via the Partner form to get added to DB)
        user = await User.create({
          username: profile.displayName,
          email: email,
          googleId: profile.id,
        });
        user.role = "user";
        
        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;