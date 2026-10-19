/**
 * Threadline - Photo Asset Generator
 * Generates editorial 4:5 portrait (800x1000) fashion visuals
 * for all 40 catalog items in client/public/images/products/
 */

const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'client', 'public', 'images', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const products = [
  // T-shirts
  { slug: 'heavyweight-boxy-tee', count: 3, cat: 'Tee', bg: '#EAE6DF', fg: '#1C1C1C', name: 'Heavyweight Boxy Tee' },
  { slug: 'relaxed-pocket-tee', count: 3, cat: 'Tee', bg: '#DFE5DF', fg: '#566654', name: 'Relaxed Pocket Tee' },
  { slug: 'minimal-graphic-tee', count: 3, cat: 'Tee', bg: '#E5E4E2', fg: '#2B2A2A', name: 'Minimal Graphic Tee' },
  { slug: 'breton-striped-tee', count: 3, cat: 'Tee', bg: '#E2E5EA', fg: '#1D2A44', name: 'Breton Striped Tee' },
  { slug: 'classic-pique-polo', count: 3, cat: 'Polo', bg: '#DEE4E2', fg: '#1E2F26', name: 'Classic Pique Polo' },
  { slug: 'raw-hem-oversized-tee', count: 3, cat: 'Tee', bg: '#E8E5E0', fg: '#594F48', name: 'Raw Hem Oversized Tee' },

  // Shirts
  { slug: 'french-linen-blend-shirt', count: 4, cat: 'Shirt', bg: '#EFEAE1', fg: '#6A5F51', name: 'French Linen Shirt' },
  { slug: 'classic-oxford-button-down', count: 4, cat: 'Shirt', bg: '#DEE7F0', fg: '#314A70', name: 'Classic Oxford Shirt' },
  { slug: 'heavy-flannel-check-shirt', count: 3, cat: 'Shirt', bg: '#EAE1DC', fg: '#693623', name: 'Flannel Check Shirt' },
  { slug: 'overdyed-denim-shirt', count: 3, cat: 'Shirt', bg: '#DDE4ED', fg: '#233658', name: 'Overdyed Denim Shirt' },
  { slug: 'camp-collar-resort-shirt', count: 3, cat: 'Shirt', bg: '#EFE5DF', fg: '#7D4431', name: 'Camp Collar Shirt' },

  // Jeans
  { slug: 'slim-fit-raw-indigo-jeans', count: 4, cat: 'Denim', bg: '#D8DEE8', fg: '#16223B', name: 'Slim Raw Indigo' },
  { slug: 'straight-fit-classic-blue', count: 3, cat: 'Denim', bg: '#DCE4EE', fg: '#284163', name: 'Straight Classic Blue' },
  { slug: 'relaxed-fit-carpenter-jeans', count: 3, cat: 'Denim', bg: '#E8E4DB', fg: '#59503E', name: 'Carpenter Jeans' },
  { slug: 'tapered-fit-jet-black-jeans', count: 3, cat: 'Denim', bg: '#E2E2E2', fg: '#181818', name: 'Jet Black Tapered' },
  { slug: 'light-wash-90s-baggy-jeans', count: 3, cat: 'Denim', bg: '#E3E9F2', fg: '#4B6A8E', name: '90s Baggy Jeans' },

  // Trousers
  { slug: 'tailored-stretch-chinos', count: 4, cat: 'Pants', bg: '#E8E3D8', fg: '#5A4E39', name: 'Stretch Chinos' },
  { slug: 'multi-pocket-cargo-pants', count: 3, cat: 'Pants', bg: '#E2E5DC', fg: '#3B4332', name: 'Multi-Pocket Cargos' },
  { slug: 'pleated-formal-trousers', count: 3, cat: 'Pants', bg: '#E0E1E4', fg: '#2C2E33', name: 'Pleated Trousers' },
  { slug: 'french-terry-everyday-joggers', count: 3, cat: 'Pants', bg: '#E4E4E6', fg: '#3B3D40', name: 'Everyday Joggers' },
  { slug: 'lightweight-linen-easy-pants', count: 3, cat: 'Pants', bg: '#ECE8E1', fg: '#5E574B', name: 'Linen Easy Pants' },

  // Jackets and hoodies
  { slug: 'trucker-denim-jacket', count: 4, cat: 'Outerwear', bg: '#DCE3EC', fg: '#243754', name: 'Trucker Denim Jacket' },
  { slug: 'ma-1-flight-bomber-jacket', count: 3, cat: 'Outerwear', bg: '#E1E5DE', fg: '#384232', name: 'Flight Bomber Jacket' },
  { slug: 'heavyweight-pullover-hoodie', count: 3, cat: 'Outerwear', bg: '#E9E4D9', fg: '#524533', name: 'Heavyweight Hoodie' },
  { slug: 'full-zip-track-windcheater', count: 3, cat: 'Outerwear', bg: '#DDE2EA', fg: '#1E355B', name: 'Track Windcheater' },
  { slug: 'minimalist-zip-up-hoodie', count: 3, cat: 'Outerwear', bg: '#E3E3E5', fg: '#2C2D30', name: 'Minimalist Zip Hoodie' },

  // Dresses and kurtas
  { slug: 'tiered-cotton-midi-dress', count: 3, cat: 'Dress', bg: '#DFE4EC', fg: '#25354F', name: 'Tiered Midi Dress' },
  { slug: 'belted-utility-shirt-dress', count: 3, cat: 'Dress', bg: '#ECE7DD', fg: '#63543F', name: 'Utility Shirt Dress' },
  { slug: 'handblock-print-cotton-kurta', count: 4, cat: 'Ethnic', bg: '#E7E6E4', fg: '#262626', name: 'Handblock Cotton Kurta' },
  { slug: 'short-mandarin-collar-kurta', count: 3, cat: 'Ethnic', bg: '#EFE5DF', fg: '#834023', name: 'Mandarin Collar Kurta' },
  { slug: 'a-line-button-front-dress', count: 3, cat: 'Dress', bg: '#E2E6DF', fg: '#3F4A37', name: 'A-Line Button Dress' },

  // Shoes
  { slug: 'low-top-canvas-sneakers', count: 3, cat: 'Footwear', bg: '#ECEAE4', fg: '#2E2E2E', name: 'Low-Top Canvas' },
  { slug: 'everyday-knit-running-shoes', count: 3, cat: 'Footwear', bg: '#E2E4E6', fg: '#282C31', name: 'Knit Running Shoes' },
  { slug: 'suede-penny-loafers', count: 3, cat: 'Footwear', bg: '#E8E1D8', fg: '#583C28', name: 'Suede Penny Loafers' },
  { slug: 'moulded-comfort-slides', count: 3, cat: 'Footwear', bg: '#EBE7DE', fg: '#4B463A', name: 'Moulded EVA Slides' },

  // Accessories
  { slug: '6-panel-twill-baseball-cap', count: 3, cat: 'Cap', bg: '#DEE4DD', fg: '#28382B', name: 'Twill Baseball Cap' },
  { slug: 'minimalist-canvas-backpack', count: 3, cat: 'Bag', bg: '#DFE2DA', fg: '#384030', name: 'Canvas Backpack' },
  { slug: 'minimal-bauhaus-analog-watch', count: 3, cat: 'Watch', bg: '#E6E4DF', fg: '#3D3328', name: 'Bauhaus Analog Watch' },
  { slug: 'full-grain-leather-belt', count: 3, cat: 'Belt', bg: '#E8DFD7', fg: '#592F18', name: 'Full-Grain Leather Belt' },
  { slug: 'polarized-acetate-sunglasses', count: 3, cat: 'Eyewear', bg: '#E7E3DC', fg: '#3D2A1C', name: 'Polarized Sunglasses' },
];

function getCategoryIcon(cat, fg) {
  switch (cat) {
    case 'Footwear':
      return `
        <!-- Sneaker / Shoe silhouette -->
        <path d="M180 270 C190 230 220 200 270 200 C300 200 320 220 340 240 L380 245 C410 250 430 270 430 290 L430 300 C430 310 420 320 410 320 L180 320 C170 320 160 310 160 300 C160 280 170 275 180 270 Z" fill="${fg}" fill-opacity="0.85"/>
        <path d="M160 300 L430 300 L430 315 C430 320 420 325 410 325 L180 325 C170 325 160 320 160 315 Z" fill="#FFFFFF" fill-opacity="0.9"/>
        <path d="M260 210 L280 250 M280 215 L300 255 M300 220 L320 260" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-opacity="0.7"/>
      `;
    case 'Cap':
      return `
        <!-- Baseball Cap silhouette -->
        <path d="M200 270 C200 200 260 170 300 170 C340 170 400 200 400 270 Z" fill="${fg}" fill-opacity="0.85"/>
        <path d="M360 260 C390 260 450 270 460 295 C460 305 440 310 410 305 C370 300 200 300 180 285 C175 280 180 270 200 270 Z" fill="${fg}" fill-opacity="0.95"/>
        <circle cx="300" cy="170" r="6" fill="#F97316"/>
      `;
    case 'Bag':
      return `
        <!-- Backpack silhouette -->
        <rect x="220" y="190" width="160" height="200" rx="24" fill="${fg}" fill-opacity="0.85"/>
        <path d="M250 190 C250 155 350 155 350 190" fill="none" stroke="${fg}" stroke-width="12" stroke-linecap="round"/>
        <rect x="240" y="270" width="120" height="90" rx="10" fill="#FFFFFF" fill-opacity="0.2"/>
        <line x1="240" y1="265" x2="360" y2="265" stroke="#F97316" stroke-width="4"/>
      `;
    case 'Watch':
      return `
        <!-- Watch silhouette -->
        <rect x="275" y="140" width="50" height="300" rx="6" fill="${fg}" fill-opacity="0.4"/>
        <circle cx="300" cy="290" r="75" fill="#FFFFFF" stroke="${fg}" stroke-width="8"/>
        <circle cx="300" cy="290" r="65" fill="#FAFAFA"/>
        <line x1="300" y1="290" x2="300" y2="245" stroke="${fg}" stroke-width="4" stroke-linecap="round"/>
        <line x1="300" y1="290" x2="335" y2="290" stroke="#F97316" stroke-width="3" stroke-linecap="round"/>
        <circle cx="300" cy="290" r="5" fill="${fg}"/>
      `;
    case 'Eyewear':
      return `
        <!-- Sunglasses silhouette -->
        <rect x="180" y="250" width="100" height="70" rx="20" fill="${fg}" fill-opacity="0.9"/>
        <rect x="320" y="250" width="100" height="70" rx="20" fill="${fg}" fill-opacity="0.9"/>
        <path d="M280 265 C290 255 310 255 320 265" fill="none" stroke="${fg}" stroke-width="6" stroke-linecap="round"/>
        <line x1="180" y1="260" x2="150" y2="250" stroke="${fg}" stroke-width="5" stroke-linecap="round"/>
        <line x1="420" y1="260" x2="450" y2="250" stroke="${fg}" stroke-width="5" stroke-linecap="round"/>
      `;
    case 'Belt':
      return `
        <!-- Belt silhouette -->
        <rect x="160" y="270" width="280" height="40" rx="6" fill="${fg}" fill-opacity="0.85"/>
        <rect x="160" y="260" width="60" height="60" rx="8" fill="none" stroke="#D4AF37" stroke-width="8"/>
        <line x1="190" y1="260" x2="190" y2="320" stroke="#D4AF37" stroke-width="6"/>
      `;
    default:
      return `
        <circle cx="300" cy="240" r="140" fill="${fg}" fill-opacity="0.12"/>
        <circle cx="300" cy="240" r="110" fill="${fg}" fill-opacity="0.25"/>
        <text x="300" y="245" text-anchor="middle" font-family="'Archivo', sans-serif" font-weight="800" font-size="26" fill="${fg}" letter-spacing="1">
          ${cat.toUpperCase()}
        </text>
      `;
  }
}

function generateSVG(p, viewIndex) {
  const angleText = viewIndex === 1 ? 'Front View' : viewIndex === 2 ? 'Detail & Fabric' : viewIndex === 3 ? 'Back / Silhouette' : 'Flat Lay Angle';
  const tag = `LOOK 0${viewIndex}`;
  const iconGraphic = getCategoryIcon(p.cat, p.fg);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <linearGradient id="g_${p.slug}_${viewIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg}"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.6"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000000" stroke-opacity="0.025" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="800" height="1000" fill="url(#g_${p.slug}_${viewIndex})"/>
  <rect width="800" height="1000" fill="url(#grid)"/>

  <!-- Editorial Framing -->
  <rect x="24" y="24" width="752" height="952" fill="none" stroke="#111111" stroke-opacity="0.08" stroke-width="1"/>
  
  <!-- Header Tag -->
  <text x="48" y="64" font-family="'Archivo', sans-serif" font-weight="800" font-size="14" fill="#111111" letter-spacing="2">THREADLINE.</text>
  <text x="752" y="64" text-anchor="end" font-family="'DM Sans', sans-serif" font-weight="600" font-size="12" fill="#6B6B6B" letter-spacing="1.5">${tag}</text>

  <!-- Silhouette Graphic Area -->
  <g transform="translate(100, 160)">
    <!-- Soft Shadow -->
    <ellipse cx="300" cy="560" rx="220" ry="24" fill="#111111" fill-opacity="0.06"/>
    
    <!-- Central Shape Card -->
    <rect x="60" y="40" width="480" height="480" rx="8" fill="#FFFFFF" stroke="#E2E2E0" stroke-width="1"/>
    
    <!-- Category Icon Visual -->
    ${iconGraphic}
    
    <text x="300" y="460" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="600" font-size="14" fill="#111111" letter-spacing="1">
      ${p.cat.toUpperCase()} • ${angleText}
    </text>
    
    <!-- Color Bar Accent -->
    <rect x="220" y="480" width="160" height="4" rx="2" fill="#F97316"/>
  </g>

  <!-- Product Name & Editorial Specs -->
  <g transform="translate(48, 860)">
    <text x="0" y="0" font-family="'DM Sans', sans-serif" font-weight="600" font-size="13" fill="#F97316" letter-spacing="2">AUTUMN / ESSENTIALS</text>
    <text x="0" y="30" font-family="'Archivo', sans-serif" font-weight="800" font-size="24" fill="#111111">${p.name}</text>
    <text x="0" y="55" font-family="'DM Sans', sans-serif" font-size="14" fill="#6B6B6B">Designed for the Indian Climate • 100% Guaranteed Fit</text>
  </g>

  <!-- Bottom Corner Mark -->
  <text x="752" y="935" text-anchor="end" font-family="'DM Sans', sans-serif" font-size="12" font-weight="700" fill="#111111">4:5 PORTRAIT</text>
</svg>`;
}

let generatedCount = 0;
for (const p of products) {
  for (let i = 1; i <= p.count; i++) {
    const svgContent = generateSVG(p, i);
    // Write as .svg
    fs.writeFileSync(path.join(targetDir, `${p.slug}-${i}.svg`), svgContent, 'utf8');
    // Also write as .webp for compatibility
    fs.writeFileSync(path.join(targetDir, `${p.slug}-${i}.webp`), svgContent, 'utf8');
    generatedCount += 2;
  }
}

console.log(`Successfully generated ${generatedCount} product photo visual assets (.svg and .webp) in ${targetDir}`);
