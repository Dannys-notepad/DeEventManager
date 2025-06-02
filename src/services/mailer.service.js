const nodemailer = require('nodemailer');
const env = require('../config/env')

module.exports = async (recipient) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: env.SMTP_USERNAME,
        pass: env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `De Event Manager <${env.SMTP_USERNAME}>`,
      to: recipient.email,
      subject: recipient.subject,
      html: recipient.html,
    });

    console.log('Email sent to:', recipient.email);
    return info;
  } catch (error) {
    console.log('Email failed:', recipient.email, error.message);
    return `mail not sent` 
  }
};
