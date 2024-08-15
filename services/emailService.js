const nodemailer = require("nodemailer");
require('dotenv').config();

// Create transporters for both primary and backup email services
const primaryTransporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.PRIMARY_EMAIL_SERVICE_USER,
    pass: process.env.PRIMARY_EMAIL_SERVICE_PASS,
  },
});

const backupTransporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.BACKUP_EMAIL_SERVICE_USER,
    pass: process.env.BACKUP_EMAIL_SERVICE_PASS,
  },
});

const sendMail = async (to, subject, text, transporter) => {
  const mailOptions = {
    from: process.env.PRIMARY_EMAIL_SERVICE_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const sendEmailWithRetry = async (to, subject, text) => {
  const maxRetries = 3;
  let attempts = 0;
  let emailSent = false;

  while (attempts < maxRetries && !emailSent) {
    emailSent = await sendMail(to, subject, text, primaryTransporter);
    if (!emailSent) {
      attempts++;
      console.log(`Retrying... Attempt ${attempts}`);
    }
  }

  // If failed after retries, switch to backup service
  if (!emailSent) {
    console.log("Switching to backup email service");
    emailSent = await sendMail(to, subject, text, backupTransporter);
  }

  return emailSent;
};

module.exports = { sendEmailWithRetry };
