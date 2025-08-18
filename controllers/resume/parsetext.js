import upload from "../../middleware/upload.js";
import pdf from "pdf-parse";
import mammoth from "mammoth";

const parseText = async (req, res) => {
  const bytesToMegabytes = (bytes) => {
    return bytes / (1024 * 1024);
  };

  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload failed" });
      }

      if (!req.files) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = req.files[0];

      try {
        let extractedText = "";

        if (file.mimetype === "application/pdf") {
          const data = await pdf(file.buffer);
          extractedText = data.text;
        } else if (
          file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          extractedText = result.value;
        } else if (file.mimetype === "text/plain") {
          extractedText = file.buffer.toString("utf8");
        } else {
          return res.status(400).json({
            error:
              "Unsupported file type. Please upload PDF, DOCX, or TXT files.",
          });
        }

        return res.status(200).json({
          message: "File uploaded & text extracted successfully",
          file: {
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: `${bytesToMegabytes(file.size).toFixed(2)} MB`,
          },
          extractedText: extractedText,
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
