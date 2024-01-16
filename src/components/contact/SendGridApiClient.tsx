import sendgridMail from "@sendgrid/mail";

interface EmailMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
}

interface SendEmailResponse {
  success: boolean;
  error?: Error;
}

class SendGridApiClient {
  constructor(apiKey: string) {
    sendgridMail.setApiKey(apiKey);
  }

  async sendEmail(
    to: string,
    from: string,
    subject: string,
    text: string
  ): Promise<SendEmailResponse> {
    const message: EmailMessage = {
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
      return { success: false, error: error as Error };
    }
  }
}

export default SendGridApiClient;
