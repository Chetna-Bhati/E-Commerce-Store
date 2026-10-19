const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// Major Indian Metros / Fast delivery zones mapping
const METRO_PIN_PREFIXES = ['11', '12', '20', '40', '41', '50', '56', '60', '70', '38', '30'];

// @desc    Check delivery timeline and COD availability by 6-digit Indian pincode
// @route   GET /api/delivery/:pincode
// @access  Public
const checkPincode = asyncHandler(async (req, res) => {
  const { pincode } = req.params;

  if (!/^\d{6}$/.test(pincode)) {
    return sendError(res, 'Please provide a valid 6-digit Indian PIN code.', 400);
  }

  // Reject impossible starting digits
  const firstDigit = pincode.charAt(0);
  if (firstDigit === '0' || firstDigit === '9') {
    return sendError(res, 'Delivery is currently not available to this PIN code.', 400);
  }

  const prefix = pincode.substring(0, 2);
  const isMetro = METRO_PIN_PREFIXES.includes(prefix);

  const daysMin = isMetro ? 2 : 4;
  const daysMax = isMetro ? 3 : 6;

  const now = new Date();
  const minDate = new Date(now);
  minDate.setDate(now.getDate() + daysMin);

  const maxDate = new Date(now);
  maxDate.setDate(now.getDate() + daysMax);

  const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const estimatedDateString = `${minDate.toLocaleDateString('en-IN', dateOptions)} - ${maxDate.toLocaleDateString('en-IN', dateOptions)}`;

  return sendSuccess(
    res,
    {
      pincode,
      isDeliverable: true,
      isMetro,
      estimatedDays: `${daysMin}-${daysMax} business days`,
      estimatedDate: estimatedDateString,
      codAvailable: true,
      freeShippingEligible: true,
      shippingThreshold: 999
    },
    'PIN code is serviceable.'
  );
});

module.exports = {
  checkPincode
};
