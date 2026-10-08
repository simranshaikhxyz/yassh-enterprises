import nodemailer from "nodemailer";

/**
 * Sends a transactional email using Nodemailer.
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing email environment credentials");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      family: 4,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"YASSH ENTERPRISES" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || "Your OTP verification code.",
      html: html || undefined,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `✅ Email successfully dispatched to ${to} [ID: ${info.messageId}]`
    );

    return info;
  } catch (error) {
    console.error("Nodemailer Dispatch Error:", error);
    throw error;
  }
};

export default sendEmail;