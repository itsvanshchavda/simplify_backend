import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { PassThrough } from "stream";

dotenv.config({ quiet: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadPdfBuffer = (buffer, filename = "resume.pdf", folder) =>
  new Promise((resolve, reject) => {
    // Configure the upload
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // raw is safest for non-image files
        folder: folder,
        overwrite: true,
        invalidate: true,
        public_id: filename.replace(/\.pdf$/i, ""),
        format: "pdf",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Feed the buffer into Cloudinary
    const readable = new PassThrough();
    readable.end(buffer);
    readable.pipe(uploadStream);
  });

export default uploadPdfBuffer;
