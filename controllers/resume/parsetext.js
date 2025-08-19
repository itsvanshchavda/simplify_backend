import upload from "../../middleware/upload.js";
import convertText from "../../helpers/convert-text.js";

const parseText = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).send({ error: "File upload failed" });
      }

      if (!req.files) {
        return res.status(400).send({ error: "No file uploaded" });
      }

      const file = req.files[0];

      try {
        const extractedText = await convertText(file);

        if (!extractedText) {
          return res.status(400).json({ error: "No text extracted from file" });
        }

        res.status(200).json({
          message: "File uploaded & text extracted successfully",
          file: {
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          },
          text: extractedText,
        });
      } catch (extractError) {
        console.error("Text extraction error:", extractError);
        return res.status(500).json({ error: "Failed to extract text" });
      }
    });
  } catch (err) {
    console.error("Unexpected error in resumeToText:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default parseText;
