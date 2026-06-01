const userModel = require('../../models/userModel');
const { hasAnyMeasurement } = require('../../constants/measurementFields');

function normalizeMeasurements(doc) {
  if (!doc?.measurements) return null;
  const m = doc.measurements;
  const payload = {
    jacketSuit: m.jacketSuit || {},
    trouser: m.trouser || {},
    nativeTop: m.nativeTop || {},
    nativeTrouser: m.nativeTrouser || {},
    shirt: m.shirt || {},
    shoes: m.shoes || {},
    updatedAt: m.updatedAt || null,
  };
  return hasAnyMeasurement(payload) ? payload : null;
}

async function getUserMeasurements(req, res) {
  try {
    const requestedUserId = req.query.userId;
    const sessionUser = await userModel.findById(req.userId).select('role');

    if (!sessionUser) {
      return res.status(401).json({ success: false, error: true, message: 'Unauthorized' });
    }

    let targetUserId = req.userId;
    if (requestedUserId && requestedUserId !== req.userId) {
      if (sessionUser.role !== 'ADMIN') {
        return res.status(403).json({ success: false, error: true, message: 'Forbidden' });
      }
      targetUserId = requestedUserId;
    }

    const user = await userModel.findById(targetUserId).select('measurements fullName email');
    if (!user) {
      return res.status(404).json({ success: false, error: true, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      error: false,
      data: normalizeMeasurements(user),
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
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

module.exports = getUserMeasurements;
