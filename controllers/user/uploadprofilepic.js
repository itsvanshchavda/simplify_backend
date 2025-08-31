import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import upload from "../../middleware/upload.js";
import User from "../../models/User.js";
import uploadFile from "../../utils/uploadfile.js";

dotenv.config({ quiet: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadProfilePic = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ error: "User not found" });
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload failed" });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = req.files[0];

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const fileExtension = file.originalname.substring(
        file.originalname.lastIndexOf(".")
      );
      const fileName = `${userId}_profile_pic${fileExtension}`;
      const fileType = file.mimetype.split("/")[1]; // e.g., jpg, png

      const result = await uploadFile(
        file.buffer,
        fileName,
        "profile_pictures",
        fileType
      );

      console.log("🚀 ~ uploadProfilePic ~ result:", result);

      if (!result) {
        return res.status(500).json({
          error: "Failed to upload profile picture",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: result.secure_url },
        { new: true }
      )
        .select("-password")
        .populate(
          "default_resume application_kit.default_job application_kit.default_cover_letter"
        );

      return res.status(200).json({
        user: updatedUser,
      });
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
