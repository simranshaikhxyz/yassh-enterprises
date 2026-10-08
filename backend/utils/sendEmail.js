import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing email environment credentials");
    }

    const transporter = nodemailer.createTransport({
      host: "74.125.24.108",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        servername: "smtp.gmail.com",
      },
    });

    const mailOptions = {
      from: `"YASSH ENTERPRISES" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || "Your OTP verification code.",
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Email successfully dispatched to ${to} [ID: ${info.messageId}]`
    );

    return info;
  } catch (error) {
    console.error("Nodemailer Dispatch Error:", error);
    throw error;
  }
};

export default sendEmail;