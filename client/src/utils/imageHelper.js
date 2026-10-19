/**
 * Resolves product image URLs safely.
 *
 * Rules:
 * 1. No URL → return default placeholder.
 * 2. Absolute URLs (http/https) → return as-is (uploaded files).
 * 3. /images/products/ paths → prefer .jpg (real AI photo), fall back to .svg.
 * 4. /uploads/ paths → prefix with API origin so dev proxy works.
 * 5. Anything else → return as-is.
 */

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
  : 'http://localhost:5000';

/**
 * Set of product slugs that have real JPG photos (AI-generated).
 * Products NOT in this set will fall back to .svg placeholders.
 */
const SLUGS_WITH_JPG = new Set([
  // T-shirts
  'heavyweight-boxy-tee', 'relaxed-pocket-tee', 'minimal-graphic-tee',
  'breton-striped-tee', 'classic-pique-polo', 'raw-hem-oversized-tee',
  // Shirts
  'french-linen-blend-shirt', 'classic-oxford-button-down', 'heavy-flannel-check-shirt',
  'overdyed-denim-shirt', 'camp-collar-resort-shirt',
  // Jeans
  'slim-fit-raw-indigo-jeans', 'straight-fit-classic-blue', 'relaxed-fit-carpenter-jeans',
  'tapered-fit-jet-black-jeans', 'light-wash-90s-baggy-jeans',
  // Trousers
  'tailored-stretch-chinos', 'multi-pocket-cargo-pants', 'pleated-formal-trousers',
  'french-terry-everyday-joggers', 'lightweight-linen-easy-pants',
  // Jackets & Hoodies
  'trucker-denim-jacket', 'ma-1-flight-bomber-jacket', 'heavyweight-pullover-hoodie',
  'full-zip-track-windcheater', 'minimalist-zip-up-hoodie',
  // Dresses & Kurtas
  'tiered-cotton-midi-dress', 'belted-utility-shirt-dress', 'handblock-print-cotton-kurta',
  'short-mandarin-collar-kurta', 'a-line-button-front-dress',
]);

export function getImageUrl(url) {
  if (!url) return DEFAULT_PRODUCT_IMAGE;

  // Already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Static product placeholder images
  if (url.startsWith('/images/products/')) {
    const withoutExt = url.replace(/\.[^/.]+$/, ''); // strip extension
    // Extract slug from path like /images/products/heavyweight-boxy-tee-1
    const filename = withoutExt.split('/').pop(); // e.g. "heavyweight-boxy-tee-1"
    const slug = filename.replace(/-\d+$/, '');   // e.g. "heavyweight-boxy-tee"
    if (SLUGS_WITH_JPG.has(slug)) {
      return withoutExt + '.jpg';
    }
    return withoutExt + '.svg';
  }

  // Backend-uploaded files served at /uploads/
  if (url.startsWith('/uploads/')) {
    return `${API_ORIGIN}${url}`;
  }

  return url;
}

export const DEFAULT_PRODUCT_IMAGE = '/images/products/heavyweight-boxy-tee-1.jpg';
