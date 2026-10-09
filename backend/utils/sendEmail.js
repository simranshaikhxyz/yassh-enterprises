
import { google } from "googleapis";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const {
      GMAIL_USER,
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      GMAIL_REDIRECT_URI,
      GMAIL_REFRESH_TOKEN,
    } = process.env;

    if (
      !GMAIL_USER ||
      !GMAIL_CLIENT_ID ||
      !GMAIL_CLIENT_SECRET ||
      !GMAIL_REFRESH_TOKEN
    ) {
      throw new Error("Missing Gmail API environment variables");
    }

    const auth = new google.auth.OAuth2(
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      GMAIL_REDIRECT_URI
    );

    auth.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

    const gmail = google.gmail({ version: "v1", auth });

    const boundary = "otp_email_boundary";
    const message = [
      `From: YASSH ENTERPRISES <${GMAIL_USER}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      html
        ? `Content-Type: multipart/alternative; boundary="${boundary}"`
        : "Content-Type: text/plain; charset=UTF-8",
      "",
      ...(html
        ? [
            `--${boundary}`,
            "Content-Type: text/plain; charset=UTF-8",
            "",
            text || "Your OTP verification code.",
            `--${boundary}`,
            "Content-Type: text/html; charset=UTF-8",
            "",
            html,
            `--${boundary}--`,
          ]
        : [text || "Your OTP verification code."]),
    ].join("\r\n");

    const raw = Buffer.from(message, "utf8").toString("base64url");

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });

    console.log("Email sent successfully:", result.data.id);
    return result.data;
  } catch (error) {
    console.error("Gmail API email error:", error.message);
    throw error;
  }
};

export default sendEmail;

