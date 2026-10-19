const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret';

let razorpayInstance = null;

try {
  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
} catch (err) {
  console.warn('Razorpay instance initialization note:', err.message);
}

// Utility to verify Razorpay Webhook or Checkout HMAC SHA256 signature
function verifyRazorpaySignature(orderId, paymentId, signature) {
  const hmac = crypto.createHmac('sha256', keySecret);
  hmac.update(`${orderId}|${paymentId}`);
  const generatedSignature = hmac.digest('hex');
  return generatedSignature === signature;
}

module.exports = {
  razorpay: razorpayInstance,
  verifyRazorpaySignature
};
