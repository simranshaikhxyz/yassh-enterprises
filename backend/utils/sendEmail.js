import nodemailer from "nodemailer";

/**
 * Sends a transactional email using Nodemailer.
 * @param {Object} options - Email parameters
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Subject header
 * @param {string} options.text - Plain text content
 * @param {string} [options.html] - Optional HTML template body
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Initialize transporter lazily so process.env values are fully loaded
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing email environment credentials (EMAIL_USER / EMAIL_PASS)");
    }

    const mailOptions = {
      from: `"YASSH ENTERPRISES" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || "Your OTP verification code.",
      html: html || undefined,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email successfully dispatched to ${to} [ID: ${info.messageId}]`);

    return info;
  } catch (error) {
    console.error("Nodemailer Dispatch Error:", error.message);
    throw new Error("Failed to send email notification. Please try again.");
  }
};

export default sendEmail;