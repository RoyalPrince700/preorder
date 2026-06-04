const NotificationModel = require('../models/notification');
const { buildNotification } = require('./notificationTemplates');

/**
 * Create an in-app notification from a template (mirrors Mailtrap user email events).
 */
async function sendUserNotification(userId, templateKey, data = {}) {
  if (!userId) {
    console.warn('[NOTIFICATION] Skipped — no userId for template:', templateKey);
    return null;
  }

  try {
    const payload = buildNotification(templateKey, data);
    const notification = new NotificationModel({
      userId,
      type: payload.type,
      templateKey: payload.templateKey,
      message: payload.message,
      orderId: payload.orderId || undefined,
      isRead: false,
    });
    await notification.save();
    console.log('[NOTIFICATION] Created', templateKey, 'for user', userId);
    return notification;
  } catch (error) {
    console.error('[NOTIFICATION] Failed to create', templateKey, error.message);
    return null;
  }
}

module.exports = sendUserNotification;
