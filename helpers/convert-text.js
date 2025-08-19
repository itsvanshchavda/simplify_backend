import pdf from "pdf-parse";
import mammoth from "mammoth";

export const convertText = async (file) => {
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
      throw new Error(
        "Unsupported file type. Please upload PDF, DOCX, or TXT files."
      );
    }

    return extractedText;
  } catch (error) {
    console.error("Error extracting text from file:", error);
  }
};

export default convertText;
