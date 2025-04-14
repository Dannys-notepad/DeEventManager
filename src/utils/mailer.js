const nodemailer = require("nodemailer");

module.exports = (recipient) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: process.env.SMTP_SERVICE,
    port: 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: `DE EVENT MANAGER <${process.env.SMTP_USERNAME}>`,
      to: recipient.email,
      subject: recipient.subject,
      html: recipient.html,
    });

    console.log("Message sent to: ", recipient.email);
  }

  main().catch(console.error);
};