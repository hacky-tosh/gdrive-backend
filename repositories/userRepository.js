const User = require("../models/User");

const findUserByGoogleId = async (googleId) => User.findOne({ googleId });

const createUser = async (userData) => new User(userData).save();

const getUserById = async (id) => User.findById(id);

module.exports = { findUserByGoogleId, createUser ,getUserById};
