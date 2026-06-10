const checkoutModel = require('../../models/checkoutModel');
const productModel = require('../../models/productModel');
const UserModel = require('../../models/userModel');
const NotificationModel = require('../../models/notification');
const { sendUserOrderConfirmationEmail } = require('../../mailtrap/emails');

const PHONE_REGEX = /^[0-9]{10,15}$/;

async function adminCreateOrder(req, res) {
  try {
    const {
      name,
      number,
      address,
      cartItems,
      note,
      paymentMethod,
      confirmOrder = true,
      amountPaid,
    } = req.body;

    const customerName = String(name || '').trim();
    const customerPhone = String(number || '').trim();
    const customerAddress = String(address || '').trim();

    if (!customerName || !customerPhone || !customerAddress) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, phone number, and address are required',
      });
    }

    if (!PHONE_REGEX.test(customerPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format (10–15 digits)',
      });
    }

    if (!Array.isArray(cartItems) || !cartItems.length) {
      return res.status(400).json({
        success: false,
        message: 'Add at least one product to the order',
      });
    }

    const productIds = cartItems.map((item) => item.productId);
    const products = await productModel.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const orderCartItems = [];
    let totalPrice = 0;

    for (const item of cartItems) {
      const product = productMap.get(String(item.productId));
      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'One or more products were not found',
        });
      }

      const quantity = Math.max(1, Number(item.quantity) || 1);
      const price = product.sellingPrice ?? product.price ?? 0;
      totalPrice += price * quantity;

      orderCartItems.push({
        productId: product._id,
        quantity,
        price,
      });
    }

    let linkedUser = await UserModel.findOne({ phone: customerPhone });
    if (!linkedUser) {
      linkedUser = await UserModel.findOne({ fullName: customerName, phone: customerPhone });
    }

    const parsedAmountPaid =
      amountPaid !== undefined && amountPaid !== '' && amountPaid !== null
        ? Number(amountPaid)
        : null;

    const savedCheckout = await checkoutModel.create({
      name: customerName,
      number: customerPhone,
      address: customerAddress,
      cartItems: orderCartItems,
      totalPrice,
      ...(parsedAmountPaid != null && !Number.isNaN(parsedAmountPaid)
        ? { amountPaid: parsedAmountPaid }
        : {}),
      paymentMethod: paymentMethod || 'Pay on Delivery',
      note: note ? String(note).trim() : '',
      status: 'Pending',
      adminConfirmed: Boolean(confirmOrder),
      userId: linkedUser?._id || null,
    });

    setImmediate(async () => {
      try {
        const hrUsers = await UserModel.find({ role: 'HR' });
        if (hrUsers.length) {
          await NotificationModel.insertMany(
            hrUsers.map((hr) => ({
              userId: hr._id,
              type: 'New Order Alert',
              message: `A manual order #${savedCheckout._id} was placed for ${customerName}.`,
              isRead: false,
              createdAt: new Date(),
            }))
          );
        }
      } catch (err) {
        console.error('[ADMIN CREATE ORDER] HR notification error:', err);
      }

      if (confirmOrder && linkedUser?.email) {
        try {
          await sendUserOrderConfirmationEmail(
            linkedUser.email,
            savedCheckout._id,
            { userId: linkedUser._id }
          );
        } catch (err) {
          console.error('[ADMIN CREATE ORDER] Confirmation email error:', err);
        }
      }
    });

    const populated = await checkoutModel
      .findById(savedCheckout._id)
      .populate('cartItems.productId', 'productName productImage sellingPrice');

    res.status(201).json({
      success: true,
      message: confirmOrder
        ? 'Order created and confirmed successfully'
        : 'Order created successfully',
      data: populated,
    });
  } catch (error) {
    console.error('[ADMIN CREATE ORDER] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order',
    });
  }
}

module.exports = adminCreateOrder;
