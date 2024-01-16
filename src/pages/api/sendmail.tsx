import SendGridApiClient from "../../components/contact/SendGridApiClient";

export default async function sendMail(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const { name, email, message } = req.body;
    const sendGridClient = new SendGridApiClient(process.env.SENDGRID_API_KEY);

    const response = await sendGridClient.sendEmail(
      process.env.MY_EMAIL,
      process.env.SENDGRID_VERIFIED_SENDER,
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
