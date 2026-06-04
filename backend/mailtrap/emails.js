const { transporter, sender } = require('./mailtrap.config');
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, ORDER_NOTIFICATION_TEMPLATE, ORDER_RECEIVED_EMAIL_TEMPLATE, ORDER_CONFIRMATION_EMAIL_TEMPLATE, PAYMENT_SUCCESS_EMAIL_TEMPLATE, ORDER_STATUS_UPDATE_EMAIL_TEMPLATE, ORDER_DELIVERED_THANK_YOU_TEMPLATE } = require('./emailTemplates');
const sendUserNotification = require('../helpers/sendUserNotification');
const { NOTIFICATION_TEMPLATE_KEYS } = require('../helpers/notificationTemplates');

// Utility function to get the correct frontend URL
const getFrontendUrl = () => {
    return process.env.FRONTEND_URL || 'https://www.wifmart.com';
};

const logMailSend = (tag, mailOptions) => {
    try {
        console.log(`[MAIL] -> ${tag}`, {
            from: mailOptions?.from,
            to: mailOptions?.to,
            subject: mailOptions?.subject,
        });
    } catch (e) {
        // ignore
    }
};

const logMailResult = (tag, response) => {
    try {
        console.log(`[MAIL] <- ${tag}`, {
            messageId: response?.messageId,
            accepted: response?.accepted,
            rejected: response?.rejected,
            response: response?.response,
        });
    } catch (e) {
        // ignore
    }
};

const logMailError = (tag, error) => {
    console.error(`[MAIL] !! ${tag} failed`, {
        message: error?.message,
        code: error?.code,
        command: error?.command,
        response: error?.response,
        responseCode: error?.responseCode,
        stack: error?.stack,
    });
};

const sendVerificationEmail = async (email, token) => {
    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Verify your email address",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", token),
        };

        logMailSend('verification email', mailOptions);
        const response = await transporter.sendMail(mailOptions);
        logMailResult('verification email', response);
        return response;
    } catch (error) {
        logMailError('verification email', error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

const sendWelcomeEmail = async (email, name = 'there', options = {}) => {
    try {
        const personalizedGreeting = name !== 'there' ? `Hi ${name}!` : 'Hello there!';
        const frontendUrl = getFrontendUrl();

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Wifmart!</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
    .container { background: white; padding: 30px; border-radius: 0; border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(to right, #1F2937, #111827); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; margin: -30px -30px 20px -30px; }
    .welcome-icon { font-size: 48px; color: #f59e0b; text-align: center; margin: 10px 0; }
    .cta-button { display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #000000; text-decoration: none; border-radius: 0; margin: 20px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="welcome-icon">🎉</div>
      <h1>Welcome to Wifmart!</h1>
      <p>Be Confident... Your journey to the best fashion, gadgets, and electronics starts here.</p>
    </div>

    <h2>${personalizedGreeting}</h2>

    <p>Thank you for joining the Wifmart community! We're thrilled to have you with us.</p>

    <p>Here's what you can do to get started:</p>

    <ul>
      <li><strong>Browse our catalog</strong> - Discover premium fashion, smart gadgets, and everyday electronics.</li>
      <li><strong>Shop by category</strong> - Find exactly what you need quickly and easily.</li>
      <li><strong>Track your orders</strong> - Real-time updates on your purchases and shipping status.</li>
      <li><strong>Manage your account</strong> - Update your profile and view your order history.</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${frontendUrl}" class="cta-button">Start Exploring</a>
    </div>

    <p>If you have any questions, feel free to reach out to our support team. We're here to help!</p>

    <p>Welcome aboard,<br>The Wifmart Team</p>
  </div>

  <div class="footer">
    <p>This is an automated welcome message from Wifmart. Please do not reply to this email.</p>
  </div>
</body>
</html>`;

        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "🎉 Welcome to Wifmart - Your Shopping Journey Begins!",
            html,
        };

        logMailSend('welcome email', mailOptions);
        const response = await transporter.sendMail(mailOptions);
        logMailResult('welcome email', response);
        if (options.userId) {
            await sendUserNotification(options.userId, NOTIFICATION_TEMPLATE_KEYS.WELCOME, { name });
        }
        return response;
    } catch (error) {
        logMailError('welcome email', error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
}

const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        };

        logMailSend('password reset email', mailOptions);
        const response = await transporter.sendMail(mailOptions);
        logMailResult('password reset email', response);
        return response;
    } catch (error) {
        logMailError('password reset email', error);
        throw new Error(`Error sending password reset email: ${error.message}`);
    }
}

const sendResetSuccessfulEmail = async (email) => {
    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        };

        logMailSend('password reset success email', mailOptions);
        const response = await transporter.sendMail(mailOptions);
        logMailResult('password reset success email', response);
        return response;
    } catch (error) {
        logMailError('password reset success email', error);
        throw new Error(`Error sending password reset successful email: ${error}`);
    }
}

module.exports = { sendVerificationEmail,sendWelcomeEmail,sendPasswordResetEmail,sendResetSuccessfulEmail};

// Admin order notification
const sendOrderNotificationEmail = async (recipients, payload) => {
    const itemsRows = (payload.cartItems || [])
        .map((it) => {
            const productObj = it?.productId || {};
            const id = productObj?._id || it?.productId;
            const name = it?.name || productObj?.productName || productObj?.name || 'Item';
            const qty = it?.quantity || 1;
            const price = productObj?.sellingPrice || it?.price || '';
            const base = getFrontendUrl().replace(/\/$/, '');
            const url = id ? `${base}/product/${id}` : '';
            const priceText = price !== '' ? price : '';
            return `<tr><td>${name}</td><td>${qty}</td><td>${priceText}</td><td>${url ? `<a href="${url}">View</a>` : ''}</td></tr>`;
        })
        .join('');

    const html = ORDER_NOTIFICATION_TEMPLATE
        .replace('{name}', payload.name)
        .replace('{number}', payload.number)
        .replace('{address}', payload.address)
        .replace('{note}', payload.note || 'N/A')
        .replace('{paymentMethod}', payload.paymentMethod || 'Pay on Delivery')
        .replace('{total}', payload.total)
        .replace('{itemsRows}', itemsRows);

    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>`,
            to: Array.isArray(recipients) ? recipients.join(', ') : recipients,
            subject: `New Order from ${payload.name}`,
            html,
        };

        logMailSend('admin order notification', mailOptions);
        const response = await transporter.sendMail(mailOptions);
        logMailResult('admin order notification', response);
        return response;
    } catch (error) {
        logMailError('admin order notification', error);
        // Throw so callers can log/report; callers already catch so it won't block user flow
        throw error;
    }
};

// User order received email (Sent immediately at checkout)
const sendUserOrderReceivedEmail = async (userEmail, payload) => {
    const itemsRows = (payload.cartItems || [])
        .map((it) => {
            const productObj = it?.productId || {};
            const name = it?.name || productObj?.productName || productObj?.name || 'Item';
            const qty = it?.quantity || 1;
            const price = productObj?.sellingPrice || it?.price || '';
            const priceText = price !== '' ? `₦${price}` : '';
            const totalPrice = price * qty;
            return `<tr><td>${name}</td><td>${qty}</td><td>${priceText}</td><td>₦${totalPrice}</td></tr>`;
        })
        .join('');

    const html = ORDER_RECEIVED_EMAIL_TEMPLATE
        .replace('{name}', payload.name)
        .replace('{orderId}', payload._id)
        .replace('{address}', payload.address)
        .replace('{note}', payload.note || 'N/A')
        .replace('{paymentMethod}', payload.paymentMethod || 'Pay on Delivery')
        .replace('{total}', `₦${payload.totalPrice}`)
        .replace('{itemsRows}', itemsRows);

    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>`,
            to: userEmail,
            subject: "Order Received - Wifmart",
            html,
        };

        logMailSend('user order received', mailOptions);
        const response = await transporter.sendMail(mailOptions);
        logMailResult('user order received', response);
        return response;
    } catch (error) {
        logMailError('user order received', error);
        throw error;
    }
};

// User order confirmation email (Sent when admin confirms)
const sendUserOrderConfirmationEmail = async (userEmail, orderId, options = {}) => {
    const html = ORDER_CONFIRMATION_EMAIL_TEMPLATE
        .replace('{orderId}', orderId)
        .replace('{frontendUrl}', getFrontendUrl());

    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>`,
            to: userEmail,
            subject: "Order Confirmed! - Wifmart",
            html,
        };

        logMailSend('user order confirmation', mailOptions);
        const response = await transporter.sendMail(mailOptions);
        logMailResult('user order confirmation', response);
        if (options.userId) {
            await sendUserNotification(options.userId, NOTIFICATION_TEMPLATE_KEYS.ORDER_CONFIRMED, { orderId });
        }
        return response;
    } catch (error) {
        logMailError('user order confirmation', error);
        throw error;
    }
};

// User payment success email
const sendPaymentSuccessEmail = async (userEmail, paymentData) => {
    const orderDetails = paymentData.orderId ? `
      <h4>Order Information</h4>
      <p><strong>Order ID:</strong> ${paymentData.orderId}</p>
      <p><strong>Items:</strong> ${paymentData.itemCount || 'Multiple items'}</p>
    ` : '';

    const html = PAYMENT_SUCCESS_EMAIL_TEMPLATE
        .replace('{transactionId}', paymentData.transactionId)
        .replace('{paymentMethod}', paymentData.paymentMethod)
        .replace('{amount}', paymentData.amount)
        .replace('{paymentDate}', paymentData.paymentDate)
        .replace('{orderDetails}', orderDetails);

    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>`,
            to: userEmail,
            subject: "Payment Successful - Wifmart",
            html,
        };

        logMailSend('user payment success', mailOptions);
        const response = await transporter.sendMail(mailOptions);
        logMailResult('user payment success', response);
        return response;
    } catch (error) {
        logMailError('user payment success', error);
        throw error;
    }
};

// Admin payment success notification
const sendPaymentSuccessNotificationToAdmin = async (paymentData) => {
    const adminRecipients = [];
    if (process.env.ADMINEMAIL1) adminRecipients.push(process.env.ADMINEMAIL1);
    if (process.env.ADMINEMAIL2) adminRecipients.push(process.env.ADMINEMAIL2);
    if (process.env.ADMIN_NOTIFICATION_EMAIL && !adminRecipients.includes(process.env.ADMIN_NOTIFICATION_EMAIL)) {
        adminRecipients.push(process.env.ADMIN_NOTIFICATION_EMAIL);
    }

    // Fallback to a default admin email if none configured
    if (adminRecipients.length === 0) {
        adminRecipients.push('admin@wifmart.com');
    }

    const orderDetails = paymentData.orderId ? `
      <h4>Order Information</h4>
      <p><strong>Order ID:</strong> ${paymentData.orderId}</p>
      <p><strong>Customer Email:</strong> ${paymentData.customerEmail || 'N/A'}</p>
      <p><strong>Items:</strong> ${paymentData.itemCount || 'Multiple items'}</p>
    ` : '';

    const html = PAYMENT_SUCCESS_EMAIL_TEMPLATE
        .replace('{transactionId}', paymentData.transactionId)
        .replace('{paymentMethod}', paymentData.paymentMethod)
        .replace('{amount}', paymentData.amount)
        .replace('{paymentDate}', paymentData.paymentDate)
        .replace('{orderDetails}', orderDetails);

    try {
    const mailOptions = {
            from: `"${sender.name}" <${sender.email}>`,
            to: adminRecipients.join(', '),
            subject: `New Payment Received - ₦${paymentData.amount} | Wifmart`,
            html,
        };

        logMailSend('admin payment success', mailOptions);
        const response = await transporter.sendMail(mailOptions);
        logMailResult('admin payment success', response);
        return response;
    } catch (error) {
        logMailError('admin payment success', error);
        throw error;
    }
};

// Order Status Update Email
const sendOrderStatusUpdateEmail = async (userEmail, orderData, options = {}) => {
    const getStatusClass = (status) => {
        const statusClasses = {
            'Pending': 'pending',
            'Processing': 'processing',
            'Shipped': 'shipped',
            'Delivered': 'delivered',
            'Cancelled': 'cancelled'
        };
        return statusClasses[status] || 'pending';
    };

    const getNextSteps = (status) => {
        const steps = {
            'Pending': '<p>Your order has been received and is awaiting processing. We will update you once it starts being prepared.</p>',
            'Processing': '<p>Your order is currently being prepared. Our team is working to get it ready for shipment.</p>',
            'Shipped': '<p>Great news! Your order has been shipped and is on its way to you. You will receive tracking information soon.</p>',
            'Delivered': '<p>Your order has been successfully delivered! We hope you enjoy your purchase.</p>',
            'Cancelled': '<p>Your order has been cancelled. If you have any questions, please contact our support team.</p>'
        };
        return steps[status] || '<p>Your order status has been updated. Please check your account for more details.</p>';
    };

    const html = ORDER_STATUS_UPDATE_EMAIL_TEMPLATE
        .replace('{orderId}', orderData.orderId)
        .replace('{orderDate}', orderData.orderDate)
        .replace('{status}', orderData.status)
        .replace('{statusClass}', getStatusClass(orderData.status))
        .replace('{nextSteps}', getNextSteps(orderData.status))
        .replace('{frontendUrl}', getFrontendUrl());

    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>`,
            to: userEmail,
            subject: `Order Status Update - ${orderData.status} | Wifmart`,
            html,
        };

        logMailSend('order status update', mailOptions);
        const response = await transporter.sendMail(mailOptions);
        logMailResult('order status update', response);
        if (options.userId) {
            await sendUserNotification(options.userId, NOTIFICATION_TEMPLATE_KEYS.ORDER_STATUS_UPDATE, {
                orderId: orderData.orderId,
                status: orderData.status,
            });
        }
        return response;
    } catch (error) {
        logMailError('order status update', error);
        throw error;
    }
};

const escapeHtml = (value) =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

// Contact form — notify admin
const sendContactFormEmail = async (adminEmail, { name, email, message }) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact form message</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
    .container { background: white; padding: 24px; border: 1px solid #e2e8f0; }
    .label { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 4px; }
    .value { margin-bottom: 16px; }
    .message { white-space: pre-wrap; background: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <h2>New contact form message</h2>
    <p class="label">From</p>
    <p class="value">${escapeHtml(name)}</p>
    <p class="label">Email</p>
    <p class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <p class="label">Message</p>
    <div class="message">${escapeHtml(message)}</div>
  </div>
</body>
</html>`;

    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>`,
            to: adminEmail,
            replyTo: email,
            subject: `Contact form: ${name}`,
            html,
        };

        logMailSend('contact form', mailOptions);
        const response = await transporter.sendMail(mailOptions);
        logMailResult('contact form', response);
        return response;
    } catch (error) {
        logMailError('contact form', error);
        throw error;
    }
};

// Order Delivered Thank You Email
const sendOrderDeliveredEmail = async (userEmail, orderId, options = {}) => {
    const html = ORDER_DELIVERED_THANK_YOU_TEMPLATE
        .replace('{orderId}', orderId)
        .replace('{frontendUrl}', getFrontendUrl());

    try {
        const mailOptions = {
            from: `"${sender.name}" <${sender.email}>`,
            to: userEmail,
            subject: "Your Order has been Delivered! - Wifmart",
            html,
        };

        logMailSend('order delivered thank you', mailOptions);
        const response = await transporter.sendMail(mailOptions);
        logMailResult('order delivered thank you', response);
        if (options.userId) {
            await sendUserNotification(options.userId, NOTIFICATION_TEMPLATE_KEYS.ORDER_DELIVERED, { orderId });
        }
        return response;
    } catch (error) {
        logMailError('order delivered thank you', error);
        throw error;
    }
};

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessfulEmail,
    sendOrderNotificationEmail,
    sendUserOrderReceivedEmail,
    sendUserOrderConfirmationEmail,
    sendPaymentSuccessEmail,
    sendPaymentSuccessNotificationToAdmin,
    sendOrderStatusUpdateEmail,
    sendOrderDeliveredEmail,
    sendContactFormEmail,
};
