import mongoose from "mongoose";

const jobSchema = mongoose.Schema({
  job_url: { type: String },
  job_title: { type: String },
  job_description: { type: String },
  job_location: { type: String },
  job_type: { type: String },
  company_name: { type: String },
  company_logo: { type: String },
  skills: { type: Array },
  experience: { type: Number },
  salary: { type: Number },
});

const Job = mongoose.model("jobs", jobSchema);
export default Job;
