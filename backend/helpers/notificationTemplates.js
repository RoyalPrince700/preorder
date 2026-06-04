/**
 * In-app notification templates — aligned with Mailtrap user email flows.
 */

const NOTIFICATION_TEMPLATE_KEYS = {
  WELCOME: 'WELCOME',
  ORDER_CONFIRMED: 'ORDER_CONFIRMED',
  ORDER_STATUS_UPDATE: 'ORDER_STATUS_UPDATE',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
};

const formatOrderRef = (orderId) => {
  if (!orderId) return '';
  const id = orderId.toString();
  return `#${id.slice(-12).toUpperCase()}`;
};

const statusSummary = (status) => {
  const copy = {
    Pending:
      'Your order has been received and is awaiting processing.',
    Processing:
      'Your order is being prepared by our team.',
    Shipped:
      'Your order has been shipped and is on its way to you.',
    Delivered:
      'Your order has been delivered. We hope you enjoy your purchase!',
    Cancelled:
      'Your order has been cancelled. Contact support if you need help.',
  };
  return copy[status] || 'Your order status has been updated.';
};

const buildWelcomeNotification = ({ name = 'there' } = {}) => {
  const greeting = name && name !== 'there' ? name : 'there';
  return {
    type: 'Welcome to Wifmart',
    templateKey: NOTIFICATION_TEMPLATE_KEYS.WELCOME,
    message: `Welcome to Wifmart, ${greeting}! Thank you for joining us. Browse our catalog, track your orders, and manage your account from your profile.`,
    orderId: null,
  };
};

const buildOrderConfirmedNotification = ({ orderId } = {}) => {
  const ref = formatOrderRef(orderId);
  return {
    type: 'Order Confirmed',
    templateKey: NOTIFICATION_TEMPLATE_KEYS.ORDER_CONFIRMED,
    message: `Great news! Your order ${ref} has been confirmed by our team and is now being processed. We will notify you when it ships.`,
    orderId: orderId || null,
  };
};

const buildOrderStatusUpdateNotification = ({ orderId, status } = {}) => {
  const ref = formatOrderRef(orderId);
  return {
    type: 'Order Status Update',
    templateKey: NOTIFICATION_TEMPLATE_KEYS.ORDER_STATUS_UPDATE,
    message: `Your order ${ref} status is now: ${status}. ${statusSummary(status)}`,
    orderId: orderId || null,
  };
};

const buildOrderDeliveredNotification = ({ orderId } = {}) => {
  const ref = formatOrderRef(orderId);
  return {
    type: 'Order Delivered',
    templateKey: NOTIFICATION_TEMPLATE_KEYS.ORDER_DELIVERED,
    message: `Your order ${ref} has been delivered! Thank you for shopping with Wifmart. We hope you love your purchase.`,
    orderId: orderId || null,
  };
};

const buildNotification = (templateKey, data = {}) => {
  switch (templateKey) {
    case NOTIFICATION_TEMPLATE_KEYS.WELCOME:
      return buildWelcomeNotification(data);
    case NOTIFICATION_TEMPLATE_KEYS.ORDER_CONFIRMED:
      return buildOrderConfirmedNotification(data);
    case NOTIFICATION_TEMPLATE_KEYS.ORDER_STATUS_UPDATE:
      return buildOrderStatusUpdateNotification(data);
    case NOTIFICATION_TEMPLATE_KEYS.ORDER_DELIVERED:
      return buildOrderDeliveredNotification(data);
    default:
      throw new Error(`Unknown notification template: ${templateKey}`);
  }
};

module.exports = {
  NOTIFICATION_TEMPLATE_KEYS,
  buildNotification,
  buildWelcomeNotification,
  buildOrderConfirmedNotification,
  buildOrderStatusUpdateNotification,
  buildOrderDeliveredNotification,
};
