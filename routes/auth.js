const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport=require("passport");
const User = require("../models/User");

const router = express.Router();
  


router.post("/signup", async (req, res) => {
  try {
    const { email, username, password, birthday } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    let uniqueUsername = username;
    let count = 1;
    while (await User.findOne({ username: uniqueUsername })) {
      uniqueUsername = `${username}${count}`;
      count++;
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = new User({ email, username, password: hashedPassword, birthday });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Received login request for email:", email);

   
    const user = await User.findOne({ email });
    if (!user){
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    } 
    if (!user.password) {
      return res.status(400).json({ message: "You signed up with Google. Set a password first." });
    }
    
    if (!user.password) {
      return res.status(400).json({ message: "You signed up with Google. Set a password first." });
    }
    

    console.log("User found:", user);
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
      console.log("Password does not match");
      return res.status(400).json({ message: "Invalid credentials" });
    } 

    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(200).json({ message: "Login successful", user: { email: user.email, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      if (!req.user) {
        console.log("Google Authentication Failed! Redirecting to home...");
        return res.redirect("/?error=authentication_failed");
      }

      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });


      console.log("Google Authentication Successful! Redirecting with token...");
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });


      res.redirect(`http://localhost:5500/trial.html?token=${token}`);
    } catch (error) {
      console.error("error during googlr auth callback:",error);
      res.redirect("/?error=server_error");
    }
  }
);




router.post("/set-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password) {
      return res.status(400).json({ message: "Password is already set. Use login instead." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json({ message: "Password set successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});




module.exports = router;
