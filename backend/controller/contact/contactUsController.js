const { sendContactFormEmail } = require('../../mailtrap/emails');

const contactUsController = async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      });
    }

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
    if (!adminEmail) {
      return res.status(500).json({
        success: false,
        message: 'Contact form is not configured. Please try again later.',
      });
    }

    await sendContactFormEmail(adminEmail, {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    res.json({
      success: true,
      message: 'Your message has been sent. We will get back to you soon.',
    });
  } catch (err) {
    console.error('contactUsController error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to send your message. Please try again later.',
    });
  }
};

module.exports = contactUsController;
