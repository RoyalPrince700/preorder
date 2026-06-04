const NotificationModel = require('../../models/notification');

const getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.userId;
    const count = await NotificationModel.countDocuments({
      userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification count.',
      count: 0,
    });
  }
};

module.exports = getUnreadNotificationCount;
