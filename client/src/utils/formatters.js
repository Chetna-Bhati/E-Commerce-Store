// Indian Rupee currency formatter
export function formatPrice(amount) {
  const numeric = Number(amount) || 0;
  return `₹${numeric.toLocaleString('en-IN')}`;
}

// Format date in Indian locale
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Calculate discount percentage
export function calculateDiscount(mrp, price) {
  const numMrp = Number(mrp) || 0;
  const numPrice = Number(price) || 0;
  if (numMrp <= numPrice || numMrp === 0) return 0;
  return Math.round(((numMrp - numPrice) / numMrp) * 100);
}
