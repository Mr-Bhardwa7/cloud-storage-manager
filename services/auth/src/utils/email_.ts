import { EmailConfig } from "next-auth/providers/email";
import nodemailer from "nodemailer";

/**
 * Sends a Magic Link to the user's email
 * @param email User's email
 * @param magicLink Unique magic link URL
 */
export async function sendMagicLink(email: string, magicLink: string, provider: EmailConfig) {
  console.log(`✅ Magic Link sent to ${email}`);
  const transporter = nodemailer.createTransport(provider.server);
  const mailOptions = {
    from: provider.from,
    to: email,
    subject: "Secure Login Link - Access Your Account",
    text: `Hello,

        You requested a secure login link. Click the link below to sign in:

        ${magicLink}

        If you did not request this, please ignore this email.

        Best regards,
        Your CloudNest Team`,
            html: `<p>Hello,</p>
                <p>You requested a secure login link. Click the button below to sign in:</p>
                <p><a href="${magicLink}" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#ffffff;text-decoration:none;border-radius:5px;">Login Now</a></p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best regards,<br>Your App Team</p>`
        };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Magic Link sent to ${email}: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Error sending magic link:", error);
    throw new Error("Failed to send magic link email.");
  }
}
