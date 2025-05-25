const nodemailer = require('nodemailer');

module.exports = async (recipient) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `De Event Manager <${process.env.SMTP_USERNAME}>`,
      to: recipient.email,
      subject: recipient.subject,
      html: recipient.html,
    });

    console.log('Email sent to:', recipient.email);
    return info;
  } catch (error) {
    console.error('Email failed:', recipient.email, error.message);
    throw error; 
  }
};
