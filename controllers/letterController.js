const letterService = require("../services/letterService");

const saveLetter = async (req, res) => {
  try {
    const { userId, content } = req.body;
    
    const savedLetter = await letterService.saveLetterToGoogleDrive(userId, content);

    res.status(201).json(savedLetter);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getAllLettersController = async (req, res) => {
  try {
    const userId = req.query.userId;
    const letters = await letterService.getAllLetters(userId);
    res.status(200).json(letters);
  } catch (error) {
    console.error("Error fetching letters:", error);
    res.status(500).json({ message: "Failed to fetch letters" });
  }
};

module.exports = { saveLetter, getAllLettersController };
