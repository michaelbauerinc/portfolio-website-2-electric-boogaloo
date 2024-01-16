import SendGridApiClient from "../../components/contact/SendGridApiClient";
import { NextApiRequest, NextApiResponse } from "next"; // Automatically inferred types

export default async function sendMail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const { name, email, message } = req.body;

    const sendGridApiKey = process.env.SENDGRID_API_KEY || "";
    const myEmail = process.env.MY_EMAIL || "";
    const sendGridVerifiedSender = process.env.SENDGRID_VERIFIED_SENDER || "";

    const sendGridClient = new SendGridApiClient(sendGridApiKey);

    const response = await sendGridClient.sendEmail(
      myEmail,
      sendGridVerifiedSender,
      `New Contact Form Submission from ${name}`,
      `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    );
    if (response.success) {
      res.status(200).json({ message: "Email sent successfully." });
    } else {
      res.status(500).json({ message: "Failed to send email." });
    }
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ message: "Server error." });
  }
}
