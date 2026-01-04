const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model"); 
const FoodPartner = require("../models/foodpartner.model"); 

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
      proxy: true,
      passReqToCallback: true // 👈 CRITICAL: Allows us to access 'req'
    },
    async (req, accessToken, refreshToken, profile, done) => { // 👈 Added 'req' as first arg
      try {
        const email = profile.emails[0].value;
        const role = req.query.state || 'user'; // 👈 Read the intended role

        // --- SCENARIO 1: User wants to login as PARTNER ---
        if (role === 'partner') {
            let partner = await FoodPartner.findOne({ email: email });
            if (partner) {
                partner.role = "partner"; // Flag for controller
                return done(null, partner);
            }
            // If trying to login as partner but no account exists:
            return done(null, false, { message: "No Partner account found with this email." });
        }

        // --- SCENARIO 2: User wants to login as USER ---
        // (Default behavior)
        if (role === 'user') {
            let user = await User.findOne({ email: email });

            if (user) {
                if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save();
                }
                user.role = "user";
                return done(null, user);
            }

            // Create new User if not found
            user = await User.create({
                username: profile.displayName,
                email: email,
                googleId: profile.id,
            });
            user.role = "user";
            return done(null, user);
        }

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;