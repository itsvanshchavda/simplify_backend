import downloadPdf from "../../utils/downloadpdf.js";
import uploadFile from "../../utils/uploadfile.js";
import { v2 as cloudinary } from "cloudinary";
import Coverletter from "../../models/Coverletter.js";
import coverLetterTemplate from "./coverlettertemplate.js";

const updateCoverletter = async (req, res) => {
  try {
    const { customdata, filename, coverletter_id, jobId } = req.body;

    const coverletter = await Coverletter.findById(coverletter_id);
    if (!coverletter) {
      return res.status(404).json({ error: "Coverletter not found" });
    }

    if (filename && !customdata?.coverletter) {
      coverletter.filename = filename;
      await coverletter.save();
      return res.status(200).json({
        message: "Coverletter filename updated successfully",
        coverletter,
      });
    }

    if (customdata?.coverletter) {
      if (coverletter.url) {
        try {
          const publicId = coverletter.url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`coverletters/${publicId}`);
          console.log("Old file deleted:", publicId);
        } catch (err) {
          console.warn("Old file delete failed:", err.message);
        }
      }

      const html = coverLetterTemplate(customdata, coverletter);
      const buffer = await downloadPdf(html);
      const result = await uploadFile(buffer, filename, "coverletters");

      if (!result) {
        return res.status(500).json({ error: "Failed to upload new PDF" });
      }

      const updatedCoverletter = await Coverletter.findOneAndUpdate(
        { _id: coverletter_id, userId: req.user._id },
        {
          url: result.secure_url,
          filename,
          body: customdata.coverletter,
          jobId: jobId || null,
        },
        { new: true }
      );

      if (!updatedCoverletter) {
        return res.status(400).json({ error: "Failed to update coverletter" });
      }

      return res.status(200).json({
        message: "Coverletter updated successfully",
        coverletter: updatedCoverletter,
      });
    }

    return res.status(400).json({ error: "No valid fields to update" });
  } catch (error) {
    console.error("Error updating coverletter:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export default updateCoverletter;
