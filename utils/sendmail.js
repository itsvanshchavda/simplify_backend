import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO || "";

// Create TransactionalEmailsApi instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const templatePasswordReset = (resetLink) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center;">
        <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
        <p style="color: #666; margin-bottom: 30px;">
          We received a request to reset your password. Click the button below to proceed:
        </p>
        
        <!-- Improved button with table-based approach for better email client support -->
        <table cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
          <tr>
            <td style="background-color: #007bff; border-radius: 5px; text-align: center;">
              <a href="${resetLink}" 
                 target="_blank"
                 style="display: inline-block; 
                        color: #ffffff !important; 
                        text-decoration: none !important; 
                        padding: 12px 20px; 
                        font-size: 16px; 
                        font-weight: bold;
                        border-radius: 5px;
                        mso-padding-alt: 0;
                        font-family: Arial, sans-serif;">
                <!--[if mso]>
                <i style="letter-spacing: 20px; mso-font-width: -100%; mso-text-raise: 18pt;">&nbsp;</i>
                <![endif]-->
                <span style="mso-text-raise: 9pt;">Reset Password</span>
                <!--[if mso]>
                <i style="letter-spacing: 20px; mso-font-width: -100%;">&nbsp;</i>
                <![endif]-->
              </a>
            </td>
          </tr>
        </table>

        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This link will expire in <strong>1 hour</strong>.
        </p>

        <!-- Plain text copy link -->
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Or copy and paste this link into your browser:<br>
          <a href="${resetLink}" style="color: #007bff; word-break: break-all;">${resetLink}</a>
        </p>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;
};

export const sendEmail = async (resetLink, email, name) => {
  console.log("🚀 ~ sendEmail ~ resetLink:", resetLink);
  if (resetLink && email && name) {
    const sendSmtpEmail = {
      to: [{ email: email }],
      sender: {
        name: " Simplify Jobs ",
        email: "bhashivira@gmail.com",
      },
      subject: "My subject",
      textContent: `Hi ${name},\n\nWelcome to  Simplify Jobs ! We're thrilled to have you join our community of forward-thinking innovators.\n\nYour account is now active and ready to use. Here's what you can do next:\n\n1. Explore our AI tools and features\n2. Check out our quickstart guides\n3. Set up your profile preferences\n\nIf you have any questions, our support team is available 24/7 at support@overnightai.com.\n\nBest regards,\nThe  Simplify Jobs  Team`,
      htmlContent: templatePasswordReset(resetLink),
    };

    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log("Email sent successfully to:", name + " " + email);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
};

export const sendForgotPass = async (email, token) => {
  if (email && token) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const sendSmtpEmail = {
      to: [{ email: email }],
      sender: {
        name: " Simplify Jobs ",
        email: "bhashivira@gmail.com",
      },
      subject: "Reset Your Password -  Simplify Jobs ",
      textContent: `Hi,\n\nWe received a request to reset your password for your  Simplify Jobs  account. Click the link below to reset it:\n\n${resetLink}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe  Simplify Jobs  Team`,
      htmlContent: `
        <p>Hi,</p>
        <p>We received a request to reset your password for your <strong> Simplify Jobs </strong> account.</p>
        <p>Click the button below to reset it:</p>
        <p><a href="${resetLink}" style="background-color:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;">Reset Password</a></p>
        <p>Or copy and paste this link in your browser:</p>
        <p><a href="${resetLink}" style="color:#007bff;text-decoration:none;">${resetLink}</a></p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p>For any assistance, contact our support team.</p>
        <p>Best regards,<br><strong>The  Simplify Jobs  Team</strong></p>
      `,
    };

    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log("Password reset email sent successfully to:", email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  }
};

export const sendSuccessResetPassword = async (email) => {
  if (email) {
    const sendSmtpEmail = {
      to: [{ email: email }],
      sender: {
        name: " Simplify Jobs ",
        email: "bhashivira@gmail.com",
      },
      subject: "Password Reset Successful -  Simplify Jobs ",
      textContent: `Hi,\n\nYour password has been successfully reset. If you didn't make this change, please contact our support team immediately.\n\nBest regards,\nThe  Simplify Jobs  Team`,
      htmlContent: `
        <div style="text-align: center; padding: 20px;">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#007bff"/>
            <path d="M7 12l3 3 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h2 style="color: #007bff; margin-top: 10px;">Password Reset Successful</h2>
        </div>
        <p>Hi,</p>
        <p>Your password has been successfully reset for your <strong> Simplify Jobs </strong> account.</p>
        <p>If you made this change, no further action is needed.</p>
        <p>If you did <strong>not</strong> request a password reset, please contact our support team immediately.</p>
        <p>For any assistance, reach out to us</p>
        <p>Best regards,<br><strong>The  Simplify Jobs  Team</strong></p>
      `,
    };

    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log("Password reset success email sent to:", email);
    } catch (error) {
      console.error("Error sending password reset success email:", error);
    }
  }
};
