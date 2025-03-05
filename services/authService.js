const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const generateJwtToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { generateJwtToken };
