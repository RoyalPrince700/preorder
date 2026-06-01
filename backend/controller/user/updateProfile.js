const userModel = require('../../models/userModel');

async function updateProfile(req, res) {
  try {
    const { fullName, location } = req.body;
    const payload = {};

    if (fullName !== undefined) {
      payload.fullName = String(fullName).trim();
    }
    if (location !== undefined) {
      payload.location = String(location).trim() || 'Not Specified';
    }

    if (!Object.keys(payload).length) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'No profile fields to update',
      });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(req.userId, payload, { new: true, runValidators: true })
      .select('-password -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'User not found',
      });
    }

    res.status(200).json({
      data: updatedUser,
      message: 'Profile updated successfully',
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = updateProfile;
