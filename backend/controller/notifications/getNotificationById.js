const NotificationModel = require("../../models/notification");

const getNotificationById = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const notification = await NotificationModel.findOne({ _id: id, userId });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notification.",
    });
  }
};

module.exports = getNotificationById;
