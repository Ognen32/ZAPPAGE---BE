import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST, // Sending smtp Host // Gmail
    service: process.env.SMTP_SERVICE, // Using gmail services
    port: process.env.SMTP_PORT, // 465 SSL less secure
    auth: {
      user: process.env.SMTP_MAIL, // Your email
      pass: process.env.SMTP_PASSWORD, // Your app password
    },
  });

  const options = {
    from: process.env.SMTP_MAIL, // Uses your email to send an email message
    to: email,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(options);
}; // To use this service activate factor verification and search for app password in your google manage account settings