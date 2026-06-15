const { sendOrderNotificationEmail } = require('../../mailtrap/emails');
const checkoutModel = require('../../models/checkoutModel');
const NotificationModel = require('../../models/notification');
const UserModel = require('../../models/userModel');

const notifyAdminsOnOrder = async (req, res) => {
  try {
    const {
      name,
      number,
      address,
      note = '',
      cartItems = [],
      total,
      totalPrice,
      paymentMethod = 'WhatsApp Order',
    } = req.body || {};

    if (!name || !number || !address || !Array.isArray(cartItems) || cartItems.length === 0 || (total == null && totalPrice == null)) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Normalize total to a number for storage (guest payloads may send formatted "total" string for email)
    let numericTotal = totalPrice;
    if (numericTotal == null) {
      if (typeof total === 'number') {
        numericTotal = total;
      } else if (typeof total === 'string') {
        numericTotal = parseFloat(String(total).replace(/[^0-9.-]/g, '')) || 0;
      } else {
        numericTotal = 0;
      }
    }

    // Normalize cart items to the shape stored in checkoutModel (supports both nested and flat shapes from frontend)
    const normalizedCartItems = (cartItems || []).map((item) => {
      const prod = item?.productId || item || {};
      const pid = prod?._id || prod || item?._id || item?.productId;
      const qty = Number(item?.quantity) || 1;
      const price = Number(prod?.sellingPrice ?? prod?.price ?? item?.price ?? 0);
      return {
        productId: pid,
        quantity: qty,
        price,
      };
    });

    // Persist the guest order so it appears in admin order listings
    let savedOrder = null;
    try {
      const newOrder = new checkoutModel({
        name,
        number,
        address,
        note,
        cartItems: normalizedCartItems,
        totalPrice: numericTotal,
        paymentMethod,
        // userId omitted / null for guest orders
      });
      savedOrder = await newOrder.save();
      console.log('[GUEST-ORDER] Created checkout record for unsigned user:', savedOrder._id);
    } catch (persistErr) {
      console.error('[GUEST-ORDER] Failed to persist guest order:', persistErr);
      // Continue to send email/notification even if persist fails, so admin is still informed
    }

    // Create HR in-app notifications (same as authenticated checkout path)
    if (savedOrder) {
      try {
        const hrUsers = await UserModel.find({ role: 'HR' });
        const hrNotifications = hrUsers.map((hr) => ({
          userId: hr._id,
          type: 'New Order Alert',
          message: `A new order #${savedOrder._id} has been placed by ${name}.`,
          isRead: false,
          createdAt: new Date(),
        }));
        if (hrNotifications.length > 0) {
          await NotificationModel.insertMany(hrNotifications);
        }
      } catch (notifErr) {
        console.error('[GUEST-ORDER] Error creating HR notifications for guest order:', notifErr);
      }
    }

    const admin1 = process.env.ADMINEMAIL1;
    const admin2 = process.env.ADMINEMAIL2;
    const recipients = [admin1, admin2].filter(Boolean);

    if (recipients.length === 0) {
      return res.status(500).json({ success: false, message: 'Admin emails not configured' });
    }

    // Send rich email using original cartItems (for product names/links) and the display total
    await sendOrderNotificationEmail(recipients, {
      name,
      number,
      address,
      note,
      cartItems,
      total,
      paymentMethod,
    });

    res.json({ success: true, orderId: savedOrder ? savedOrder._id : null });
  } catch (err) {
    console.error('notifyAdminsOnOrder error:', err);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};

module.exports = notifyAdminsOnOrder;


