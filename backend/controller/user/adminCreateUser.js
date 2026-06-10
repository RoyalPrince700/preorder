const userModel = require('../../models/userModel');
const { sendWelcomeEmail } = require('../../mailtrap/emails');

const PHONE_REGEX = /^[0-9]{10,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = ['GENERAL', 'ADMIN'];

async function adminCreateUser(req, res) {
  try {
    const { fullName, email, phone, role } = req.body;

    const name = String(fullName || '').trim();
    const normalizedEmail = email ? String(email).trim().toLowerCase() : '';
    const normalizedPhone = phone ? String(phone).trim() : '';
    const userRole = role || 'GENERAL';

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    if (!normalizedEmail && !normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: 'Either email or phone number is required',
      });
    }

    if (normalizedEmail && !EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    if (normalizedPhone && !PHONE_REGEX.test(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format (10–15 digits)',
      });
    }

    if (!ALLOWED_ROLES.includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be GENERAL or ADMIN',
      });
    }

    if (normalizedEmail) {
      const existingEmail = await userModel.findOne({ email: normalizedEmail });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email already exists',
        });
      }
    }

    if (normalizedPhone) {
      const existingPhone = await userModel.findOne({ phone: normalizedPhone });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'A user with this phone number already exists',
        });
      }
    }

    const newUser = await userModel.create({
      fullName: name,
      ...(normalizedEmail && { email: normalizedEmail }),
      ...(normalizedPhone && { phone: normalizedPhone }),
      role: userRole,
      isVerified: true,
    });

    if (normalizedEmail) {
      sendWelcomeEmail(normalizedEmail, name, { userId: newUser._id }).catch((err) => {
        console.error('[ADMIN CREATE USER] Failed to send welcome email:', err.message);
      });
    }

    res.status(201).json({
      success: true,
      message: normalizedEmail
        ? 'User created and welcome email sent'
        : 'User created successfully',
      data: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error('[ADMIN CREATE USER] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create user',
    });
  }
}

module.exports = adminCreateUser;
