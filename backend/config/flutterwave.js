const Flutterwave = require('flutterwave-node-v3');

// Only initialize Flutterwave when online payments are explicitly enabled
// and the required environment variables are present. This prevents
// serverless environments (like Vercel) from crashing if keys are missing
// while payments are turned off.
const shouldEnablePayments = process.env.ENABLE_ONLINE_PAYMENT === 'true';
const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

let flw = null;

if (shouldEnablePayments) {
    if (!publicKey || !secretKey) {
        console.error('[FLW] Flutterwave keys missing while ENABLE_ONLINE_PAYMENT is true.');
    } else {
        flw = new Flutterwave(publicKey, secretKey);
    }
}

module.exports = flw;