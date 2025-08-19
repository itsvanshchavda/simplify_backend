import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  job_title: { type: String },
  degree_required: { type: Boolean },
  company: { type: String },
  experience: { type: String }, // e.g., "2-3 years"
  skills: { type: [String] },
  platform: { type: String },
  location: { type: String },
  company_logo: { type: String },
  applications: { type: Number },
  compensation: { type: String },
  job_url: { type: String, unique: true },
  job_posted: { type: String },
  description: { type: String },
  remote: { type: Boolean }, // true if remote/hybrid
  job_type: { type: Array },
  industry: { type: String },
  sponsorship: { type: Boolean },
  easyapply: { type: Boolean },
});

const Job = mongoose.model("jobs", jobSchema);
export default Job;
