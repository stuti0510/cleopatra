const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5001/auth/google/callback",
    
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      if (!profile.emails || profile.emails.length === 0) {
        return done(new Error("No email associated with this Google account"), null);
      }
      
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {

        let uniqueUsername = profile.displayName;
        let count = 1;

        while (await User.findOne({ username: uniqueUsername })) {
          uniqueUsername = `${profile.displayName}${count}`;
          count++;
        }

        user = new User({
          email: profile.emails[0].value,
          username: profile.displayName,
          password: "", 
          birthday: "",  
        });
        await user.save();
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return done(null, { user, token });
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports=passport;
