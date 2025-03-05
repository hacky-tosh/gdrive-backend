const { google } = require("googleapis");
const letterRepository = require("../repositories/letterRepository");
const { getUserById, findUserByGoogleId } = require("../repositories/userRepository");
const Letter = require("../models/Letter");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const drive = google.drive({ version: "v3", auth: oauth2Client });

const getAllLetters = async (userId) => {
  try {
    const user = await findUserByGoogleId(userId);

    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    });

    const letters = await Letter.find({ userId });

    const lettersWithContent = await Promise.all(
      letters.map(async (letter) => {
        try {
          const response = await drive.files.get({
            fileId: letter.googleDriveId,
            alt: "media",
          });

          return {
            ...letter._doc,
            content: response.data,
          };
        } catch (error) {
          console.error(`Error fetching file ${letter.googleDriveId} from Google Drive:`, error);
          return {
            ...letter._doc,
            content: "Failed to fetch content from Google Drive",
          };
        }
      })
    );

    console.log("🚀🚀🚀 ~ getAllLetters ~ length:", lettersWithContent.length);
    console.log("🚀🚀🚀 ~ getAllLetters ~ lettersWithContent:", lettersWithContent);
    return lettersWithContent;
  } catch (error) {
    console.error("Error fetching letters:", error);
    throw new Error("Failed to fetch letters");
  }
};

const saveLetterToGoogleDrive = async (userId, content) => {
  try {
    const user = await findUserByGoogleId(userId);

    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    });

    if (oauth2Client.isTokenExpiring()) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);

      await updateUserTokens(userId, credentials.access_token, credentials.refresh_token);
    }

    const fileMetadata = {
      name: `Letter-${userId}-${Date.now()}.txt`,
      mimeType: "text/plain",
    };

    const media = {
      mimeType: "text/plain",
      body: content,
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return await letterRepository.saveLetter({
      userId,
      content,
      googleDriveId: file.data.id,
    });
  } catch (error) {
    console.error("Error saving letter to Google Drive:", error);
    throw new Error("Failed to save letter to Google Drive");
  }
};

module.exports = { saveLetterToGoogleDrive, getAllLetters };
