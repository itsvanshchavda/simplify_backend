import passport from "passport";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://simplify-service.vercel.app/api/v1/auth/google/callback"
          : "http://localhost:5000/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            firstName,
            lastName,
            email,
            provider: "google",
            providerId: profile.id,
            profilePicture: profile.photos[0].value,
          });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });

        user.token = token;
        await user.save();

        return done(null, { user, token });
      } catch (error) {
        return done(err, null);
      }
    }
  )
);

// passport.use(
//   new LinkedInStrategy(
//     {
//       clientID: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       callbackURL: "/auth/linkedin/callback",
//       scope: ["r_emailaddress", "r_liteprofile"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value;
//         const fullName = profile.displayName?.split(" ") || [];
//         const firstName = fullName[0] || "";
//         const lastName = fullName[1] || "";

//         let user = await User.findOne({ email });
//         if (!user) {
//           user = await User.create({
//             firstName,
//             lastName,
//             email,
//             provider: "linkedin",
//             providerId: profile.id,
//           });
//         }

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//           expiresIn: "30d",
//         });

//         user.token = token;
//         await user.save();

//         return done(null, { user, token });
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

export default passport;
