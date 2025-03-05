const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      passReqToCallback: true,
      accessType: "offline", 
      prompt: "consent",
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/drive", 
        "https://www.googleapis.com/auth/drive.file", 
      ],
    },
    (req, accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        email: profile.emails[0].value,
        accessToken,
        refreshToken,
      };
      done(null, user);
    }
  )
);

router.get("/google", (req, res, next) => {
  passport.authenticate("google", {
    accessType: "offline",
    prompt: "consent",
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const { id, accessToken, refreshToken } = req.user;
    try {
      let user = await User.findOne({ googleId: id });
      
      if (user) {
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();
      } else {
        user = new User({
          googleId: id,
          email: req.user.email,
        name: req.user.name,
          profilePicture: req.user.profilePicture,
          accessToken,
          refreshToken,
        });
        await user.save();
        }

      const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.cookie("token", token, { httpOnly: true });

      res.redirect(
        `http://localhost:3000/auth/google/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&token=${token}&id=${id}`
      );
        } catch (error) {
      console.error("Error handling Google callback:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);


module.exports = router;
