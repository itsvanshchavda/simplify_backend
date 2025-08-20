import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },

    profilePicture: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
    },

    password: {
      type: String,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

    provider: {
      type: String,
    },

    providerId: {
      type: String,
    },

    default_resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resumes",
    },

    work: { type: Object },
    education: { type: Object },
    projects: { type: Object },
    skills: { type: Object },
    languages: { type: Object },
    totalYearsOfExperience: { type: String },
    socialLinks: {
      linkedIn: { type: String },
      github: { type: String },
      portfolio: { type: String },
    },

    phone: {
      type: String,
    },

    onboardingStep: {
      type: Number,
      default: 0,
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
    },

    application_kit: {
      default_customized_resume: {
        type: Object,
      },

      default_job: {
        type: Object,
      },

      default_followup_mail: {
        type: Object,
      },

      default_cover_letter: {
        type: Object,
      },
    },

    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

export default User;
