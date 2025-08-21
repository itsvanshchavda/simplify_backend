import mongoose from "mongoose";

const coverletterSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobs",
    },

    body: {
      type: String,
    },

    filename: {
      type: String,
    },

    url: {
      type: String,
    },
  },
  { timestamps: true }
);

const Coverletter = mongoose.model("coverletters", coverletterSchema);
export default Coverletter;
