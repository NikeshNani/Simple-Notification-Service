const { sendEmailWithRetry } = require("../services/emailService");

const sendNotification = async (req, res) => {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  try {
    const emailSent = await sendEmailWithRetry(to, subject, text);
    if (emailSent) {
      return res.status(200).json({ message: "Notification sent" });
    } else {
      return res.status(500).json({ message: "Failed to send notification after retries" });
    }
  } catch (error) {
    console.error("Error in sendNotification:", error);
    return res.status(500).json({ message: "Failed to send notification" });
  }
};

module.exports = { sendNotification };
