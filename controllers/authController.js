const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../config/googleAuth");

const loginSuccess = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, { httpOnly: true });
  res.redirect("http://localhost:3000/dashboard");
};

module.exports = { loginSuccess };
