import sendgridMail from "@sendgrid/mail";

class SendGridApiClient {
  constructor(apiKey) {
    sendgridMail.setApiKey(apiKey);
  }

  async sendEmail(to, from, subject, text) {
    const message = {
      to,
      from,
      subject,
      text,
    };

    try {
      await sendgridMail.send(message);
      return { success: true };
    } catch (error) {
      console.error("Error sending email with SendGrid", error);
      return { success: false, error };
    }
  }
}

export default SendGridApiClient;
