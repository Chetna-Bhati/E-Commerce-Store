const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Validate coupon code and return discount calculation
// @route   POST /api/coupons/validate
// @access  Public / Private
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  const coupons = await query(
    `
    SELECT id, code, discount_type, discount_value, min_order_value, max_discount, is_active, expires_at
    FROM coupons
    WHERE code = ? AND is_active = TRUE AND expires_at > NOW()
    LIMIT 1
    `,
    [code.toUpperCase().trim()]
  );

  if (coupons.length === 0) {
    return sendError(res, 'Invalid or expired coupon code.', 400);
  }

  const coupon = coupons[0];
  const orderSubtotal = parseFloat(subtotal) || 0;
  const minOrder = parseFloat(coupon.min_order_value) || 0;

  if (orderSubtotal < minOrder) {
    return sendError(
      res,
      `Coupon requires a minimum order subtotal of ₹${minOrder.toLocaleString('en-IN')}.`,
      400
    );
  }

  let discount = 0;
  if (coupon.discount_type === 'FLAT') {
    discount = parseFloat(coupon.discount_value);
  } else if (coupon.discount_type === 'PERCENTAGE') {
    discount = (orderSubtotal * parseFloat(coupon.discount_value)) / 100;
    if (coupon.max_discount) {
      discount = Math.min(discount, parseFloat(coupon.max_discount));
    }
  }

  // Ensure discount does not exceed subtotal
  discount = Math.min(discount, orderSubtotal);
  discount = Math.round(discount * 100) / 100;

  return sendSuccess(
    res,
    {
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: parseFloat(coupon.discount_value),
      discountAmount: discount,
      newSubtotal: Math.max(0, orderSubtotal - discount)
    },
    `Coupon applied! You saved ₹${discount.toLocaleString('en-IN')}.`
  );
});

module.exports = {
  validateCoupon
};
