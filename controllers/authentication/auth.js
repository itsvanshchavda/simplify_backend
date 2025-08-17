import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

// Google
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
  failureRedirect: process.env.AUTH_FAILURE_URL,
});

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, data) => {
    if (err || !data) {
      console.error("Authentication failed:", err);
      return res.redirect(process.env.AUTH_FAILURE_URL);
    }

    const token = data.token;
    const user = data.user;
    console.log("Authentication successful:", user);
    res.redirect(`${process.env.AUTH_SUCCESS_URL}${token}`);
  })(req, res, next);
};

// LinkedIn
// export const linkedinAuth = passport.authenticate("linkedin", {
//   session: false,
// });

// export const linkedinCallback = (req, res, next) => {
//   passport.authenticate("linkedin", { session: false }, (err, data) => {
//     if (err || !data) return res.status(401).json({ message: "Auth failed" });
//     res.json({ token: data.token, user: data.user });
//   })(req, res, next);
// };
