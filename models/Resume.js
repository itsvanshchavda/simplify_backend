import mongoose from "mongoose";

const resumeSchema = mongoose.Schema(
  {
    url: { type: String },
    filename: { type: String },
    text: { type: String },
    json: { type: Object },
    resume_type: {
      type: Number,
      default: 1,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    customized: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    skills: {
      type: Array,
    },
    yearsOfExperience: {
      type: Number,
    },
    degreeType: {
      type: Number,
    },

    jobinfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobs",
    },
  },
  {
    timestamps: true,
  }
);

const resumeModel = mongoose.model("resumes", resumeSchema);

export default resumeModel;
