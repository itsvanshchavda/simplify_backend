import User from "../../models/User.js";

const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      onboardingStep,
      profilePicture,
      firstName,
      lastName,
      default_job,
      default_followup_mail,
      default_cover_letter,
      onboardingCompleted,
    } = req.body;
    const user = await User.findById(userId).populate("default_resume");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (default_job && default_job != null) {
      user.application_kit.default_job = default_job;
    }

    if (default_followup_mail && default_followup_mail != null) {
      user.application_kit.default_followup_mail = default_followup_mail;
    }
    if (default_cover_letter && default_cover_letter != null) {
      user.application_kit.default_cover_letter = default_cover_letter;
    }

    if (onboardingStep) {
      user.onboardingStep = onboardingStep;
    }

    if (profilePicture && profilePicture != null) {
      user.profilePicture = profilePicture;
    }

    if (onboardingCompleted === true || onboardingCompleted === false) {
      // Ensure onboardingCompleted is a boolean
      user.onboardingCompleted = onboardingCompleted;
    }

    // Save the updated user

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default updateUser;
