import downloadPdf from "../../utils/downloadpdf.js";
import uploadPdfBuffer from "../../utils/uploadpdfbuffer.js";
import resumeTemplate from "./resumetemplate.js";

const jsonToPdf = async (req, res) => {
  try {
    const { parsedData, filename } = req.body;

    if (!parsedData) {
      return res.status(400).json({
        error: "Resume json is not provided",
      });
    }

    const html = resumeTemplate(parsedData);
    const buffer = await downloadPdf(html);
    const result = await uploadPdfBuffer(buffer, filename);

    console.log("Uploaded PDF URL:", result);

    if (!result) {
      return res.status(500).json({
        error: "Failed to upload PDF",
      });
    }

    res.status(200).json({
      message: "PDF generated and uploaded successfully",
      url: result?.secure_url,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Something went wrong while generating PDF" });
  }
};

export default jsonToPdf;
