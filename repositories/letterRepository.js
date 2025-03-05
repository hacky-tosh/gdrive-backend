const Letter = require("../models/Letter");

const saveLetter = async (letterData) => new Letter(letterData).save();


const getAllLettersByUserId = async (userId) => {
    return await Letter.find({ userId }); 
  };
  
  
module.exports = { saveLetter, getAllLettersByUserId };
