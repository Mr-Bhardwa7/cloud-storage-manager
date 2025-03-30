import nodemailer from "nodemailer";

const {
  BREVO_SMTP_HOST,
  BREVO_SMTP_PORT,
  BREVO_SMTP_USER,
  BREVO_SMTP_PASS,
  BREVO_SENDER_EMAIL,
} = process.env;

if (!BREVO_SMTP_HOST || !BREVO_SMTP_PORT || !BREVO_SMTP_USER || !BREVO_SMTP_PASS) {
  throw new Error("Missing Brevo SMTP configuration in environment variables.");
}

const transporter = nodemailer.createTransport({
  host: BREVO_SMTP_HOST,
  port: Number(BREVO_SMTP_PORT),
  secure: Number(BREVO_SMTP_PORT) === 465, // True for 465, false for others
  auth: {
    user: BREVO_SMTP_USER,
    pass: BREVO_SMTP_PASS,
  },
});

/**
 * Sends a Magic Link to the user's email
 * @param email User's email
 * @param magicLink Unique magic link URL
 */
export async function sendMagicLink(email: string, magicLink: string) {
  const mailOptions = {
    from: `"Clould Nest" <${BREVO_SENDER_EMAIL}>`,
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
