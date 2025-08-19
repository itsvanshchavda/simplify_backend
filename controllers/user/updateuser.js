import User from "../../models/User.js";

const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const { application_kit, onboardingStep, profilePicture } = req.body;
    // find user and update
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.application_kit = application_kit;

    user.onboardingStep = onboardingStep;

    user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default updateUser;
