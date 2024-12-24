// routes/user.js
const express = require("express");
const User = require("../../models/user");
const router = express.Router();

// Login Route
router.get("/login", (req, res) => {
  res.render("login", { layout: "admin-layout", user: [] });
});

router.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email, password: req.body.password });

  if (!user) {
    return res.render("login", {
      layout: "admin-layout",
      user: { message: "i think u enter wrong email or pasasword" },
    });
  }
  req.session.user_id =  user._id;
  req.session.user = user;
  res.redirect("/");
});

// Signup Route
router.get("/signup", (req, res) => {
  res.render("signup", { layout: "admin-layout"});
});

router.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.send("User already exists");
    }

    const user = new User(req.body);
    await user.save();
    
    res.redirect("/login");
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).send("An error occurred during sign-up.");
  }
});

// Logout Route
router.get('/logout', (req, res) => {
  req.session.user = null;
  req.session.user_id =  null;
  res.redirect('/login');
});

// Show all users

module.exports = router;
