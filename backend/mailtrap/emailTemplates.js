const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
  <div style="background: linear-gradient(to right, #1F2937, #111827); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #e2e8f0;">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #f59e0b;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>The Wifmart Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
  <div style="background: linear-gradient(to right, #1F2937, #111827); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #e2e8f0;">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #f59e0b; color: #000000; width: 50px; height: 50px; line-height: 50px; border-radius: 0; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>The Wifmart Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc;">
  <div style="background: linear-gradient(to right, #1F2937, #111827); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #e2e8f0;">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #f59e0b; color: #000000; padding: 12px 20px; text-decoration: none; border-radius: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>The Wifmart Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const ORDER_RECEIVED_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Received</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
    .header { background: linear-gradient(to right, #1F2937, #111827); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
    .content { background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; }
    .order-details { background: #f8fafc; padding: 15px; border-radius: 0; margin: 20px 0; border: 1px solid #e2e8f0; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background-color: #f1f5f9; font-weight: bold; }
    .total { font-weight: bold; color: #0f172a; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
    .action-button { display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #000000; text-decoration: none; border-radius: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Order Received!</h1>
    <p>Thank you for your order, {name}!</p>
  </div>

  <div class="content">
    <p>We have received your order and our team is currently reviewing it. You will receive another email once your order is confirmed.</p>
    <div class="order-details">
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Delivery Address:</strong> {address}</p>
      <p><strong>Payment Method:</strong> {paymentMethod}</p>
      <p><strong>Note:</strong> {note}</p>

      <h4>Items Ordered</h4>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {itemsRows}
        </tbody>
      </table>

      <div class="total">
        <p><strong>Total Amount: {total}</strong></p>
      </div>
    </div>

    <p>If you have any questions, feel free to contact our support team.</p>

    <p>Best regards,<br>The Wifmart Team</p>
  </div>

  <div class="footer">
    <p>This is an automated message from Wifmart. Please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const ORDER_CONFIRMATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
    .header { background: linear-gradient(to right, #1F2937, #111827); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
    .content { background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; }
    .order-details { background: #f8fafc; padding: 15px; border-radius: 0; margin: 20px 0; border: 1px solid #e2e8f0; border-left: 4px solid #f59e0b; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
    .action-button { display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #000000; text-decoration: none; border-radius: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Order Confirmed! 🎉</h1>
    <p>Great news! Your order has been confirmed.</p>
  </div>

  <div class="content">
    <p>Hello,</p>
    <p>Your order <strong>#{orderId}</strong> has been confirmed by our team and is now being processed for shipment.</p>
    
    <div class="order-details">
      <p>We are getting everything ready. You can keep tabs on your order status directly from your account dashboard.</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{frontendUrl}/order" class="action-button">Track My Order</a>
    </div>

    <p>We will notify you again once your order has been shipped!</p>

    <p>Best regards,<br>The Wifmart Team</p>
  </div>

  <div class="footer">
    <p>This is an automated message from Wifmart. Please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PAYMENT_SUCCESS_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
    .header { background: linear-gradient(to right, #1F2937, #111827); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
    .content { background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; }
    .payment-details { background: #f8fafc; padding: 15px; border-radius: 0; margin: 20px 0; border: 1px solid #e2e8f0; border-left: 4px solid #f59e0b; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background-color: #f1f5f9; font-weight: bold; }
    .total { font-weight: bold; color: #f59e0b; font-size: 18px; }
    .success-icon { font-size: 48px; color: #f59e0b; text-align: center; margin: 10px 0; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="success-icon">✓</div>
    <h1>Payment Successful!</h1>
    <p>Your payment has been processed successfully</p>
  </div>

  <div class="content">
    <div class="payment-details">
      <h3>Payment Details</h3>
      <p><strong>Transaction ID:</strong> {transactionId}</p>
      <p><strong>Payment Method:</strong> {paymentMethod}</p>
      <p><strong>Amount Paid:</strong> <span class="total">₦{amount}</span></p>
      <p><strong>Payment Date:</strong> {paymentDate}</p>

      {orderDetails}

      <p><strong>Status:</strong> <span style="color: #F97316; font-weight: bold;">Payment Completed Successfully</span></p>
    </div>

    <p>Thank you for your payment! Your order is now being processed.</p>
    <p>You will receive updates on your order status via email and in-app notifications.</p>

    <p>Best regards,<br>The Wifmart Team</p>
  </div>

  <div class="footer">
    <p>This is an automated message from Wifmart. Please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const ORDER_NOTIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Notification</title>
  <style>
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e2e8f0; }
    th { background: #f1f5f9; font-weight: bold; }
  </style>
</head>
<body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 700px; margin: 0 auto; padding: 20px; background: #f8fafc;">
  <h2 style="margin-top: 0;">New Order Placed</h2>
  <p>A customer just initiated an order. Here are the details:</p>

  <h3>Customer</h3>
  <p>
    <strong>Name:</strong> {name}<br/>
    <strong>Phone:</strong> {number}<br/>
    <strong>Address:</strong> {address}<br/>
    <strong>Note:</strong> {note}
  </p>

  <h3>Items</h3>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Link</th>
      </tr>
    </thead>
    <tbody>
      {itemsRows}
    </tbody>
  </table>

  <p>
    <strong>Payment Method:</strong> {paymentMethod}<br/>
    <strong>Total:</strong> {total}
  </p>

  <p style="color:#64748b; font-size: 12px;">This message was sent automatically by Wifmart backend.</p>
</body>
</html>
`;

const ORDER_STATUS_UPDATE_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Update - Wifmart</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
    .container { background: white; padding: 30px; border-radius: 0; border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(to right, #1F2937, #111827); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; margin: -30px -30px 20px -30px; }
    .status-badge { display: inline-block; padding: 8px 16px; border-radius: 0; font-weight: bold; text-transform: uppercase; font-size: 12px; margin: 10px 0; letter-spacing: 0.05em; }
    .status-pending { background-color: #FEF3C7; color: #92400E; }
    .status-processing { background-color: #DBEAFE; color: #1E40AF; }
    .status-shipped { background-color: #D1FAE5; color: #065F46; }
    .status-delivered { background-color: #f59e0b; color: #000000; }
    .status-cancelled { background-color: #FEE2E2; color: #991B1B; }
    .order-details { background: #f8fafc; padding: 20px; border-radius: 0; margin: 20px 0; border: 1px solid #e2e8f0; border-left: 4px solid #f59e0b; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .action-button { display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #000000; text-decoration: none; border-radius: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Order Status Update</h1>
      <p>Your order status has been updated</p>
    </div>

    <div class="order-details">
      <h3>Order Information</h3>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Order Date:</strong> {orderDate}</p>
      <p><strong>Status:</strong> <span class="status-badge status-{statusClass}">{status}</span></p>
    </div>

    <div style="background: #F0F9FF; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F97316;">
      <h4 style="margin-top: 0; color: #0F172A;">What's Next?</h4>
      {nextSteps}
    </div>

    <p>You can track your order and view all updates in your account dashboard.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{frontendUrl}/order" class="action-button">View My Orders</a>
    </div>

    <p>If you have any questions about your order, please don't hesitate to contact our support team.</p>

    <p>Best regards,<br>The Wifmart Team</p>
  </div>

  <div class="footer">
    <p>This is an automated message from Wifmart. Please do not reply to this email.</p>
    <p>Need help? Contact us at <a href="mailto:support@wifmart.com">support@wifmart.com</a></p>
  </div>
</body>
</html>
`;

const ORDER_DELIVERED_THANK_YOU_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You For Your Order</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
    .container { background: white; padding: 30px; border-radius: 0; border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(to right, #1F2937, #111827); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; margin: -30px -30px 20px -30px; }
    .welcome-icon { font-size: 48px; color: #f59e0b; text-align: center; margin: 10px 0; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .action-button { display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #000000; text-decoration: none; border-radius: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="welcome-icon">🎁</div>
      <h1>Order Delivered!</h1>
      <p>Thank you for shopping with Wifmart</p>
    </div>

    <h2>Hi there!</h2>

    <p>We are thrilled to let you know that your order <strong>#{orderId}</strong> has been successfully delivered!</p>

    <p>We hope you love your new purchase. At Wifmart, we strive to bring you the best in fashion, gadgets, and electronics, and we're so glad you chose us.</p>

    <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F97316;">
      <h4 style="margin-top: 0; color: #0F172A;">How did we do?</h4>
      <p style="margin-bottom: 0;">Your feedback means the world to us. If you have a moment, we'd love to hear about your experience.</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{frontendUrl}" class="action-button">Continue Shopping</a>
    </div>

    <p>If there are any issues with your order, please reply to this email or contact our support team. We're always here to help.</p>

    <p>Thank you once again,<br>The Wifmart Team</p>
  </div>

  <div class="footer">
    <p>This is an automated message from Wifmart. Please do not reply to this email.</p>
  </div>
</body>
</html>
`;

module.exports = {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  ORDER_NOTIFICATION_TEMPLATE,
  ORDER_RECEIVED_EMAIL_TEMPLATE,
  ORDER_CONFIRMATION_EMAIL_TEMPLATE,
  PAYMENT_SUCCESS_EMAIL_TEMPLATE,
  ORDER_STATUS_UPDATE_EMAIL_TEMPLATE,
  ORDER_DELIVERED_THANK_YOU_TEMPLATE
};
