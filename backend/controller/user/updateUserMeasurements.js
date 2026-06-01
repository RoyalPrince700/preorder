const userModel = require('../../models/userModel');
const { sanitizeMeasurements, hasAnyMeasurement } = require('../../constants/measurementFields');

async function updateUserMeasurements(req, res) {
  try {
    const { userId, measurements } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'userId is required',
      });
    }

    const sanitized = sanitizeMeasurements(measurements);

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        measurements: {
          jacketSuit: sanitized.jacketSuit,
          trouser: sanitized.trouser,
          nativeTop: sanitized.nativeTop,
          nativeTrouser: sanitized.nativeTrouser,
          shirt: sanitized.shirt,
          shoes: sanitized.shoes,
          updatedAt: new Date(),
          updatedBy: req.userId,
        },
      },
      { new: true, runValidators: true }
    ).select('measurements fullName email');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'User not found',
      });
    }

    const payload = {
      jacketSuit: updatedUser.measurements?.jacketSuit || {},
      trouser: updatedUser.measurements?.trouser || {},
      nativeTop: updatedUser.measurements?.nativeTop || {},
      nativeTrouser: updatedUser.measurements?.nativeTrouser || {},
      shirt: updatedUser.measurements?.shirt || {},
      shoes: updatedUser.measurements?.shoes || {},
      updatedAt: updatedUser.measurements?.updatedAt || null,
    };

    res.status(200).json({
      success: true,
      error: false,
      message: hasAnyMeasurement(payload)
        ? 'Measurements saved successfully'
        : 'Measurements cleared',
      data: hasAnyMeasurement(payload) ? payload : null,
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: true,
      message: err.message || err,
    });
  }
}

module.exports = updateUserMeasurements;
