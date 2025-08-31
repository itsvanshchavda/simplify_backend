import mongoose from "mongoose";

const coverletterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    formdata: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phone: { type: String },
      coverletter: { type: String },
    },

    primary: {
      type: Boolean,
      default: false,
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
