-- Threadline Database Seed Data
-- MySQL 8.0+

USE threadline_db;

-- Clear tables in reverse dependency order
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE wishlist;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE coupons;
TRUNCATE TABLE product_images;
TRUNCATE TABLE products;
TRUNCATE TABLE addresses;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- 1. USERS (bcrypt hash for 'password123')
-- =========================================================================
INSERT INTO users (id, name, email, password_hash, role, phone) VALUES
(1, 'Threadline Admin', 'admin@threadline.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADMIN', '+919876543210'),
(2, 'Aarav Sharma', 'user@threadline.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'USER', '+919812345678');

-- =========================================================================
-- 2. CATEGORIES
-- =========================================================================
INSERT INTO categories (id, name, slug, description) VALUES
(1, 'T-shirts', 't-shirts', 'Heavyweight tees, boxy fits, clean basics and everyday pocket tees.'),
(2, 'Shirts', 'shirts', 'Breathable linen blends, structured oxfords, corduroys and casual checks.'),
(3, 'Jeans', 'jeans', 'Raw selvedge, relaxed carpenter cuts, vintage washes and tapered denim.'),
(4, 'Trousers', 'trousers', 'Tailored stretch chinos, ripstop cargos, pleated pants and relaxed joggers.'),
(5, 'Jackets and hoodies', 'jackets-and-hoodies', 'Denim truckers, flight bombers, 400 GSM hoodies and track windcheaters.'),
(6, 'Dresses and kurtas', 'dresses-and-kurtas', 'Pure cotton midi dresses, shirt dresses and artisanal handblock kurtas.'),
(7, 'Shoes', 'shoes', 'Vulcanized canvas sneakers, suede loafers, running trainers and comfort slides.'),
(8, 'Accessories', 'accessories', 'Brushed twill caps, waxed canvas backpacks, leather belts and sunglasses.');

-- =========================================================================
-- 3. ADDRESSES (Test User)
-- =========================================================================
INSERT INTO addresses (id, user_id, name, phone, street_address, landmark, city, state, pincode, is_default) VALUES
(1, 2, 'Aarav Sharma', '+919812345678', 'Flat 402, Green Glen Heights, Bellandur Outer Ring Road', 'Near EcoSpace Tech Park', 'Bengaluru', 'Karnataka', '560103', TRUE);

-- =========================================================================
-- 4. PRODUCTS (40 items across 8 categories)
-- =========================================================================
INSERT INTO products (id, category_id, name, slug, description, fabric, price, mrp, stock, sizes, colors, rating, review_count, is_active) VALUES
-- Category 1: T-shirts (1-6)
(1, 1, 'Heavyweight Boxy Tee', 'heavyweight-boxy-tee',
 'A relaxed boxy silhouette crafted from combed heavyweight cotton. Features drop shoulders, a thick 1-inch ribbed collar that holds shape after repeated washes, and reinforced twin-needle stitching at hem and sleeves.',
 '240 GSM 100% Combed Cotton', 799.00, 1499.00, 48,
 '[{"size": "S", "stock": 14}, {"size": "M", "stock": 0}, {"size": "L", "stock": 18}, {"size": "XL", "stock": 16}, {"size": "XXL", "stock": 0}]',
 '[{"name": "Charcoal Black", "hex": "#1C1C1C"}, {"name": "Bone White", "hex": "#F0EFEA"}, {"name": "Muted Olive", "hex": "#5D6352"}]',
 4.8, 142, TRUE),

(2, 1, 'Relaxed Pocket Tee', 'relaxed-pocket-tee',
 'An everyday crewneck cut with a chest patch pocket. Pre-shrunk and bio-washed for a super soft hand feel from the first wear.',
 '200 GSM Bio-Washed Cotton', 699.00, 1199.00, 35,
 '[{"size": "S", "stock": 8}, {"size": "M", "stock": 12}, {"size": "L", "stock": 15}, {"size": "XL", "stock": 0}]',
 '[{"name": "Sage Green", "hex": "#778574"}, {"name": "Dusty Blue", "hex": "#5D737E"}, {"name": "Off-White", "hex": "#F4F3EF"}]',
 4.6, 89, TRUE),

(3, 1, 'Minimal Graphic Tee', 'minimal-graphic-tee',
 'Clean typography screen-printed on medium-weight cotton. Pre-treated to prevent print cracking and fading over time.',
 '220 GSM Cotton Jersey', 849.00, 1399.00, 24,
 '[{"size": "S", "stock": 0}, {"size": "M", "stock": 10}, {"size": "L", "stock": 8}, {"size": "XL", "stock": 6}]',
 '[{"name": "Washed Black", "hex": "#2B2A2A"}, {"name": "Vintage Ecru", "hex": "#EAE5DA"}]',
 4.7, 63, TRUE),

(4, 1, 'Breton Striped Tee', 'breton-striped-tee',
 'Classic nautical horizontal stripes yarn-dyed for permanent color depth. Features a boat-style bound crew collar and straight hem.',
 '100% Yarn-Dyed Cotton', 899.00, 1599.00, 40,
 '[{"size": "S", "stock": 10}, {"size": "M", "stock": 15}, {"size": "L", "stock": 0}, {"size": "XL", "stock": 10}, {"size": "XXL", "stock": 5}]',
 '[{"name": "Navy/White", "hex": "#1D2A44"}, {"name": "Black/Ecru", "hex": "#232323"}]',
 4.9, 118, TRUE),

(5, 1, 'Classic Pique Polo', 'classic-pique-polo',
 'Structured honeycomb knit polo with genuine mother-of-pearl buttons, a flat-knit collar that will not curl, and subtle side vents.',
 '260 GSM Honeycomb Cotton', 1099.00, 1899.00, 32,
 '[{"size": "S", "stock": 6}, {"size": "M", "stock": 10}, {"size": "L", "stock": 12}, {"size": "XL", "stock": 4}, {"size": "XXL", "stock": 0}]',
 '[{"name": "Dark Navy", "hex": "#162032"}, {"name": "Pine Green", "hex": "#2C4035"}, {"name": "Burgundy", "hex": "#581825"}]',
 4.6, 76, TRUE),

(6, 1, 'Raw Hem Oversized Tee', 'raw-hem-oversized-tee',
 'Subtly distressed raw cut hemline with French terry inner texture. Roomy sleeves with a clean drop-shoulder contour.',
 '220 GSM Cotton Terry', 899.00, 1499.00, 18,
 '[{"size": "S", "stock": 4}, {"size": "M", "stock": 0}, {"size": "L", "stock": 8}, {"size": "XL", "stock": 6}]',
 '[{"name": "Stone Grey", "hex": "#8A8D8F"}, {"name": "Earth Brown", "hex": "#4F443B"}]',
 4.5, 41, TRUE),

-- Category 2: Shirts (7-11)
(7, 2, 'French Linen-Blend Shirt', 'french-linen-blend-shirt',
 'Breathable natural flax blended with long-staple cotton for high airflow in Indian summers. Relaxed resort collar with curved hem.',
 '55% Linen, 45% Cotton', 1699.00, 2999.00, 28,
 '[{"size": "S", "stock": 6}, {"size": "M", "stock": 10}, {"size": "L", "stock": 0}, {"size": "XL", "stock": 8}, {"size": "XXL", "stock": 4}]',
 '[{"name": "Natural Flax", "hex": "#D8CEBE"}, {"name": "Sky Blue", "hex": "#9ABDD3"}, {"name": "Pure White", "hex": "#FFFFFF"}]',
 4.8, 175, TRUE),

(8, 2, 'Classic Oxford Button-Down', 'classic-oxford-button-down',
 'A timeless wardrobe pillar in heavyweight pinpoint oxford fabric. Finished with durable box pleat at the back and chalk buttons.',
 '100% Pinpoint Oxford Cotton', 1499.00, 2499.00, 36,
 '[{"size": "S", "stock": 8}, {"size": "M", "stock": 12}, {"size": "L", "stock": 10}, {"size": "XL", "stock": 0}, {"size": "XXL", "stock": 6}]',
 '[{"name": "Oxford Blue", "hex": "#4A6FA5"}, {"name": "Crisp White", "hex": "#FAFAFA"}, {"name": "Soft Pink", "hex": "#E8C5C8"}]',
 4.9, 210, TRUE),

(9, 2, 'Heavy Flannel Check Shirt', 'heavy-flannel-check-shirt',
 'Brushed on both exterior and interior for maximum warmth and loft. Double chest utility pockets with reinforced pocket flaps.',
 '100% Brushed Cotton Flannel', 1599.00, 2799.00, 22,
 '[{"size": "S", "stock": 0}, {"size": "M", "stock": 7}, {"size": "L", "stock": 9}, {"size": "XL", "stock": 4}, {"size": "XXL", "stock": 2}]',
 '[{"name": "Forest Plaid", "hex": "#2E4334"}, {"name": "Rust Amber", "hex": "#8C4A2F"}, {"name": "Shadow Grey", "hex": "#4D4E53"}]',
 4.7, 94, TRUE),

(10, 2, 'Overdyed Denim Shirt', 'overdyed-denim-shirt',
 'Medium-weight indigo twill enzyme-washed for a soft drape. Western-style yoke and snap pearl buttons throughout.',
 '7.5 oz Washed Cotton Twill', 1799.00, 2999.00, 19,
 '[{"size": "S", "stock": 5}, {"size": "M", "stock": 8}, {"size": "L", "stock": 0}, {"size": "XL", "stock": 6}]',
 '[{"name": "Indigo Wash", "hex": "#2C436D"}, {"name": "Faded Black", "hex": "#303030"}]',
 4.8, 88, TRUE),

(11, 2, 'Camp Collar Resort Shirt', 'camp-collar-resort-shirt',
 'Silky-smooth viscose fabric with a retro Cuban collar. Drapes naturally and keeps cool in high humidity.',
 '100% Viscose Rayon', 1299.00, 2199.00, 26,
 '[{"size": "S", "stock": 6}, {"size": "M", "stock": 10}, {"size": "L", "stock": 10}, {"size": "XL", "stock": 0}]',
 '[{"name": "Terracotta Leaf", "hex": "#A75D43"}, {"name": "Olive Abstract", "hex": "#55604C"}]',
 4.6, 52, TRUE),

-- Category 3: Jeans (12-16)
(12, 3, 'Slim-Fit Raw Indigo Jeans', 'slim-fit-raw-indigo-jeans',
 'Deep unwashed indigo denim with 2% elastane for comfortable movement. Classic copper hardware and chainstitched hems.',
 '12.5 oz Stretch Selvedge Denim', 1999.00, 3499.00, 38,
 '[{"size": "30", "stock": 8}, {"size": "32", "stock": 12}, {"size": "34", "stock": 0}, {"size": "36", "stock": 10}, {"size": "38", "stock": 8}]',
 '[{"name": "Deep Indigo", "hex": "#1B2A4A"}, {"name": "Raw Rinse", "hex": "#121A2E"}]',
 4.8, 164, TRUE),

(13, 3, 'Straight-Fit Classic Blue', 'straight-fit-classic-blue',
 '100% rigid cotton denim cut straight from hip to hem. Features subtle hand-sanded whiskers and marble wash effect.',
 '13 oz 100% Rigid Denim', 1899.00, 3199.00, 30,
 '[{"size": "30", "stock": 0}, {"size": "32", "stock": 12}, {"size": "34", "stock": 10}, {"size": "36", "stock": 8}]',
 '[{"name": "Mid Vintage Blue", "hex": "#3B5A82"}, {"name": "Light Indigo", "hex": "#5B7CA6"}]',
 4.7, 120, TRUE),

(14, 3, 'Relaxed Fit Carpenter Jeans', 'relaxed-fit-carpenter-jeans',
 'Utility-focused design with hammer loop, dual side tool pockets, and triple-needle structural seam reinforcement.',
 '12 oz Heavy Cotton Canvas Denim', 2199.00, 3699.00, 20,
 '[{"size": "30", "stock": 4}, {"size": "32", "stock": 0}, {"size": "34", "stock": 8}, {"size": "36", "stock": 5}, {"size": "38", "stock": 3}]',
 '[{"name": "Faded Khaki", "hex": "#A89F88"}, {"name": "Vintage Blue", "hex": "#4C627D"}]',
 4.6, 67, TRUE),

(15, 3, 'Tapered Fit Jet Black Jeans', 'tapered-fit-jet-black-jeans',
 'Sulphur-dyed stay-black cotton denim engineered to resist fading after multiple washes. Roomy thighs tapering smoothly to ankle.',
 '11.5 oz Stay-Black Stretch Denim', 1899.00, 3299.00, 34,
 '[{"size": "30", "stock": 6}, {"size": "32", "stock": 14}, {"size": "34", "stock": 10}, {"size": "36", "stock": 0}, {"size": "38", "stock": 4}]',
 '[{"name": "Pitch Black", "hex": "#0D0D0D"}]',
 4.9, 198, TRUE),

(16, 3, 'Light-Wash 90s Baggy Jeans', 'light-wash-90s-baggy-jeans',
 'Authentic 90s vintage wide-leg fit with generous room through the thigh and knee. Heavy stone-washed for authentic fading.',
 '13.5 oz Stone-Washed Denim', 2099.00, 3499.00, 25,
 '[{"size": "30", "stock": 5}, {"size": "32", "stock": 10}, {"size": "34", "stock": 0}, {"size": "36", "stock": 10}]',
 '[{"name": "Sky Bleach", "hex": "#7D9BB8"}, {"name": "Acid Ice", "hex": "#A4BBD2"}]',
 4.7, 85, TRUE),

-- Category 4: Trousers (17-21)
(17, 4, 'Tailored Stretch Chinos', 'tailored-stretch-chinos',
 'Smart casual chinos woven with combed cotton twill. Clean front with slanted side pockets and tailored buttoned welt back pockets.',
 '98% Cotton, 2% Spandex Twill', 1599.00, 2699.00, 42,
 '[{"size": "30", "stock": 10}, {"size": "32", "stock": 0}, {"size": "34", "stock": 16}, {"size": "36", "stock": 10}, {"size": "38", "stock": 6}]',
 '[{"name": "British Khaki", "hex": "#9E8B6E"}, {"name": "Dark Olive", "hex": "#404938"}, {"name": "Navy Blue", "hex": "#1B2433"}]',
 4.8, 182, TRUE),

(18, 4, 'Multi-Pocket Cargo Pants', 'multi-pocket-cargo-pants',
 'Tactical military-inspired cargos with 6 functional bellows pockets, knee articulation pleats, and drawstring cuff adjusters.',
 'Ripstop Cotton Weave', 1899.00, 3199.00, 28,
 '[{"size": "30", "stock": 6}, {"size": "32", "stock": 10}, {"size": "34", "stock": 0}, {"size": "36", "stock": 12}]',
 '[{"name": "Army Olive", "hex": "#4E5743"}, {"name": "Desert Tan", "hex": "#A9977D"}, {"name": "Stealth Black", "hex": "#1F2022"}]',
 4.7, 95, TRUE),

(19, 4, 'Pleated Formal Trousers', 'pleated-formal-trousers',
 'Double forward pleats with a relaxed straight drape. Wrinkle-resistant wool-poly blend with an extended tab waistband.',
 'Wool-Blend Poly Twill', 1999.00, 3499.00, 20,
 '[{"size": "30", "stock": 0}, {"size": "32", "stock": 6}, {"size": "34", "stock": 8}, {"size": "36", "stock": 4}, {"size": "38", "stock": 2}]',
 '[{"name": "Charcoal Grey", "hex": "#383B40"}, {"name": "Midnight Black", "hex": "#141416"}]',
 4.9, 110, TRUE),

(20, 4, 'French Terry Everyday Joggers', 'french-terry-everyday-joggers',
 'Ultra-soft looped cotton interior with an elasticated drawstring waistband, deep zippered phone pockets, and snug ribbed cuffs.',
 '320 GSM 100% Loopback Cotton', 1399.00, 2299.00, 34,
 '[{"size": "S", "stock": 8}, {"size": "M", "stock": 12}, {"size": "L", "stock": 0}, {"size": "XL", "stock": 10}, {"size": "XXL", "stock": 4}]',
 '[{"name": "Heather Grey", "hex": "#9FA1A4"}, {"name": "Jet Black", "hex": "#181818"}]',
 4.6, 134, TRUE),

(21, 4, 'Lightweight Linen Easy Pants', 'lightweight-linen-easy-pants',
 'Relaxed wide leg trousers with full elastic back waist and drawstring front. Perfect for breezy tropical days.',
 '100% Washed Linen', 1799.00, 2999.00, 16,
 '[{"size": "S", "stock": 4}, {"size": "M", "stock": 0}, {"size": "L", "stock": 8}, {"size": "XL", "stock": 4}]',
 '[{"name": "Sandstone", "hex": "#C9BDB0"}, {"name": "Muted Olive", "hex": "#626B5C"}]',
 4.7, 48, TRUE),

-- Category 5: Jackets and hoodies (22-26)
(22, 5, 'Trucker Denim Jacket', 'trucker-denim-jacket',
 'Heavyweight structured denim jacket with dual button-flap chest pockets, adjustable side waist tabs, and welt hand pockets.',
 '14 oz Heavy Indigo Denim', 2499.00, 4299.00, 22,
 '[{"size": "S", "stock": 4}, {"size": "M", "stock": 8}, {"size": "L", "stock": 0}, {"size": "XL", "stock": 10}]',
 '[{"name": "Classic Stonewash", "hex": "#3E5C83"}, {"name": "Deep Indigo", "hex": "#192843"}]',
 4.9, 147, TRUE),

(23, 5, 'MA-1 Flight Bomber Jacket', 'ma-1-flight-bomber-jacket',
 'Water-resistant satin flight nylon shell with safety orange lining, ribbed cuffs/collar, and signature sleeve zip utility pocket.',
 'Water-Resistant Satin Nylon', 2999.00, 4999.00, 18,
 '[{"size": "S", "stock": 0}, {"size": "M", "stock": 6}, {"size": "L", "stock": 8}, {"size": "XL", "stock": 3}, {"size": "XXL", "stock": 1}]',
 '[{"name": "Sage Olive", "hex": "#4C5645"}, {"name": "Matte Black", "hex": "#1C1C1E"}]',
 4.8, 92, TRUE),

(24, 5, 'Heavyweight Pullover Hoodie', 'heavyweight-pullover-hoodie',
 'Dense 400 GSM brushed fleece with a double-layered structured hood (no drawstrings for a clean architectural look) and kangaroo pocket.',
 '400 GSM Fleece-Lined Cotton', 1899.00, 3199.00, 32,
 '[{"size": "S", "stock": 6}, {"size": "M", "stock": 0}, {"size": "L", "stock": 14}, {"size": "XL", "stock": 8}, {"size": "XXL", "stock": 4}]',
 '[{"name": "Sand Dune", "hex": "#D1C2A5"}, {"name": "Washed Black", "hex": "#242426"}, {"name": "Forest Green", "hex": "#27382B"}]',
 4.9, 215, TRUE),

(25, 5, 'Full-Zip Track Windcheater', 'full-zip-track-windcheater',
 'Ultralight shell with mesh lining, stand-up collar with packable hood, and elastic shock cords at the hem to lock out wind.',
 'Lightweight Ripstop Poly', 1699.00, 2799.00, 15,
 '[{"size": "S", "stock": 3}, {"size": "M", "stock": 5}, {"size": "L", "stock": 7}, {"size": "XL", "stock": 0}]',
 '[{"name": "Cobalt/White", "hex": "#1C448E"}, {"name": "Charcoal/Orange", "hex": "#333333"}]',
 4.5, 39, TRUE),

(26, 5, 'Minimalist Zip-Up Hoodie', 'minimalist-zip-up-hoodie',
 'Clean two-way YKK metal zipper, raglan sleeve construction for seamless shoulder comfort, and reinforced ribbed trims.',
 '350 GSM Combed French Terry', 1799.00, 2999.00, 25,
 '[{"size": "S", "stock": 0}, {"size": "M", "stock": 10}, {"size": "L", "stock": 10}, {"size": "XL", "stock": 5}]',
 '[{"name": "Charcoal", "hex": "#303236"}, {"name": "Muted Camel", "hex": "#A48261"}]',
 4.7, 78, TRUE),

-- Category 6: Dresses and kurtas (27-31)
(27, 6, 'Tiered Cotton Midi Dress', 'tiered-cotton-midi-dress',
 'Flowy tiered skirt in lightweight mulmul cotton. Features side seam pockets, gentle elasticated cuffs, and a delicate tie neck.',
 '100% Woven Mulmul Cotton', 1699.00, 2899.00, 28,
 '[{"size": "XS", "stock": 5}, {"size": "S", "stock": 8}, {"size": "M", "stock": 0}, {"size": "L", "stock": 10}, {"size": "XL", "stock": 5}]',
 '[{"name": "Indigo Floral", "hex": "#273B5B"}, {"name": "Ochre Yellow", "hex": "#C89538"}]',
 4.8, 105, TRUE),

(28, 6, 'Belted Utility Shirt Dress', 'belted-utility-shirt-dress',
 'Structured knee-length shirt dress with detachable fabric belt, turn-up sleeves, mother-of-pearl buttons, and side slit vents.',
 'Breathable Linen-Cotton Blend', 1899.00, 3299.00, 20,
 '[{"size": "S", "stock": 4}, {"size": "M", "stock": 8}, {"size": "L", "stock": 0}, {"size": "XL", "stock": 8}]',
 '[{"name": "Khaki Tan", "hex": "#B19F83"}, {"name": "Crisp White", "hex": "#FDFCFA"}]',
 4.7, 68, TRUE),

(29, 6, 'Handblock Print Cotton Kurta', 'handblock-print-cotton-kurta',
 'Authentic artisan woodblock-printed straight kurta with Mandarin collar, functional wooden buttons, and twin side slits.',
 'Hand-Block 60s Cambric Cotton', 1499.00, 2499.00, 35,
 '[{"size": "S", "stock": 8}, {"size": "M", "stock": 0}, {"size": "L", "stock": 15}, {"size": "XL", "stock": 8}, {"size": "XXL", "stock": 4}]',
 '[{"name": "Bagru Black", "hex": "#222222"}, {"name": "Sanganeri Indigo", "hex": "#1F3A5C"}]',
 4.9, 189, TRUE),

(30, 6, 'Short Mandarin Collar Kurta', 'short-mandarin-collar-kurta',
 'Contemporary short-length kurta tailored for pairing with chinos or jeans. Crafted from breathable slub textured khadi cotton.',
 '100% Slub Khadi Cotton', 1199.00, 1999.00, 30,
 '[{"size": "S", "stock": 0}, {"size": "M", "stock": 10}, {"size": "L", "stock": 12}, {"size": "XL", "stock": 5}, {"size": "XXL", "stock": 3}]',
 '[{"name": "Rust Orange", "hex": "#B85D35"}, {"name": "Natural Beige", "hex": "#D6CEBF"}, {"name": "Olive Green", "hex": "#4C583F"}]',
 4.7, 114, TRUE),

(31, 6, 'A-Line Button-Front Dress', 'a-line-button-front-dress',
 'Flattering A-line silhouette with coconut shell buttons running down the front. Breathable eco-friendly Tencel cotton blend.',
 'Lightweight Tencel Blend', 1799.00, 2999.00, 18,
 '[{"size": "S", "stock": 5}, {"size": "M", "stock": 7}, {"size": "L", "stock": 6}, {"size": "XL", "stock": 0}]',
 '[{"name": "Olive Green", "hex": "#4B5643"}, {"name": "Terracotta", "hex": "#A25740"}]',
 4.6, 57, TRUE),

-- Category 7: Shoes (32-35)
(32, 7, 'Low-Top Canvas Sneakers', 'low-top-canvas-sneakers',
 'Durable 14 oz heavy cotton canvas upper with vulcanized rubber foxing tape and cushioned ortholite foam insole.',
 'Vulcanized Rubber & Heavy Canvas', 1499.00, 2499.00, 32,
 '[{"size": "UK 7", "stock": 6}, {"size": "UK 8", "stock": 10}, {"size": "UK 9", "stock": 0}, {"size": "UK 10", "stock": 10}, {"size": "UK 11", "stock": 6}]',
 '[{"name": "Off-White", "hex": "#ECE9E2"}, {"name": "Jet Black", "hex": "#1A1A1A"}]',
 4.8, 220, TRUE),

(33, 7, 'Everyday Knit Running Shoes', 'everyday-knit-running-shoes',
 'Seamless engineered breathable mesh upper on a responsive EVA foam sole with high-grip rubber pods on the outsole.',
 'Engineered Mesh with EVA Midsole', 2199.00, 3699.00, 28,
 '[{"size": "UK 7", "stock": 0}, {"size": "UK 8", "stock": 8}, {"size": "UK 9", "stock": 12}, {"size": "UK 10", "stock": 5}, {"size": "UK 11", "stock": 3}]',
 '[{"name": "Slate Grey", "hex": "#6C7177"}, {"name": "Triple Black", "hex": "#111111"}]',
 4.7, 138, TRUE),

(34, 7, 'Suede Penny Loafers', 'suede-penny-loafers',
 'Handcrafted genuine split suede leather with traditional saddle strap, leather lining, and stacked rubberized heel.',
 'Genuine Split Suede Leather', 2899.00, 4999.00, 16,
 '[{"size": "UK 7", "stock": 4}, {"size": "UK 8", "stock": 0}, {"size": "UK 9", "stock": 8}, {"size": "UK 10", "stock": 4}]',
 '[{"name": "Snuff Brown", "hex": "#6B4932"}, {"name": "Classic Navy", "hex": "#1C2942"}]',
 4.9, 87, TRUE),

(35, 7, 'Moulded Comfort Slides', 'moulded-comfort-slides',
 'Waterproof single-piece injection moulded EVA foam with ergonomic footbed contouring and textured anti-slip sole pattern.',
 'Dual-Density Cushioned EVA', 799.00, 1299.00, 45,
 '[{"size": "UK 6", "stock": 10}, {"size": "UK 7", "stock": 12}, {"size": "UK 8", "stock": 15}, {"size": "UK 9", "stock": 0}, {"size": "UK 10", "stock": 8}]',
 '[{"name": "Bone Beige", "hex": "#DFD7CA"}, {"name": "Charcoal", "hex": "#2D2D2D"}]',
 4.6, 175, TRUE),

-- Category 8: Accessories (36-40)
(36, 8, '6-Panel Twill Baseball Cap', '6-panel-twill-baseball-cap',
 'Unstructured low-profile crown with pre-curved visor, antique brass strap closure, and embroidered air eyelets.',
 '100% Heavy Brushed Twill', 599.00, 999.00, 40,
 '[{"size": "Free size", "stock": 40}]',
 '[{"name": "Forest Green", "hex": "#27382B"}, {"name": "Faded Navy", "hex": "#2B3C56"}, {"name": "Black", "hex": "#1A1A1A"}]',
 4.7, 98, TRUE),

(37, 8, 'Minimalist Canvas Backpack', 'minimalist-canvas-backpack',
 'Water-repellent 16 oz waxed canvas daypack with padded 15-inch laptop compartment, leather zipper pulls, and dual bottle pockets.',
 '16 oz Waxed Cotton Canvas (20L)', 1999.00, 3499.00, 22,
 '[{"size": "Free size", "stock": 22}]',
 '[{"name": "Olive Drab", "hex": "#4B5341"}, {"name": "Tan Khaki", "hex": "#9F8E73"}, {"name": "Obsidian", "hex": "#1F1F1F"}]',
 4.9, 142, TRUE),

(38, 8, 'Minimal Bauhaus Analog Watch', 'minimal-bauhaus-analog-watch',
 '40mm brushed 316L stainless steel case with scratch-resistant mineral crystal glass, Japanese quartz movement, and top-grain leather strap.',
 '316L Stainless Steel & Genuine Leather', 2499.00, 4499.00, 15,
 '[{"size": "Free size", "stock": 15}]',
 '[{"name": "Tan Leather / White Dial", "hex": "#B07D53"}, {"name": "Black / Black Dial", "hex": "#181818"}]',
 4.8, 76, TRUE),

(39, 8, 'Full-Grain Leather Belt', 'full-grain-leather-belt',
 'Vegetable-tanned 35mm wide full-grain leather strap with bevelled burnished edges and solid antique brass prong buckle.',
 '100% Vegetable-Tanned Leather', 899.00, 1499.00, 30,
 '[{"size": "32", "stock": 8}, {"size": "34", "stock": 0}, {"size": "36", "stock": 12}, {"size": "38", "stock": 10}]',
 '[{"name": "Cognac Brown", "hex": "#733D22"}, {"name": "Classic Black", "hex": "#1C1C1C"}]',
 4.9, 131, TRUE),

(40, 8, 'Polarized Acetate Sunglasses', 'polarized-acetate-sunglasses',
 'Handcrafted Italian-style cellulose acetate frames with UV400 category 3 polarized lenses and 5-barrel stainless steel hinges.',
 'Cellulose Acetate & Polarized CR-39 Lenses', 1399.00, 2299.00, 26,
 '[{"size": "Free size", "stock": 26}]',
 '[{"name": "Tortoise Amber", "hex": "#664027"}, {"name": "Matte Black", "hex": "#1F1F1F"}]',
 4.8, 89, TRUE);

-- =========================================================================
-- 5. PRODUCT IMAGES (3-4 images per product, 4:5 aspect ratio WebP mapping)
-- =========================================================================
INSERT INTO product_images (product_id, url, position) VALUES
-- Product 1
(1, '/images/products/heavyweight-boxy-tee-1.svg', 1),
(1, '/images/products/heavyweight-boxy-tee-2.svg', 2),
(1, '/images/products/heavyweight-boxy-tee-3.svg', 3),
-- Product 2
(2, '/images/products/relaxed-pocket-tee-1.svg', 1),
(2, '/images/products/relaxed-pocket-tee-2.svg', 2),
(2, '/images/products/relaxed-pocket-tee-3.svg', 3),
-- Product 3
(3, '/images/products/minimal-graphic-tee-1.svg', 1),
(3, '/images/products/minimal-graphic-tee-2.svg', 2),
(3, '/images/products/minimal-graphic-tee-3.svg', 3),
-- Product 4
(4, '/images/products/breton-striped-tee-1.svg', 1),
(4, '/images/products/breton-striped-tee-2.svg', 2),
(4, '/images/products/breton-striped-tee-3.svg', 3),
-- Product 5
(5, '/images/products/classic-pique-polo-1.svg', 1),
(5, '/images/products/classic-pique-polo-2.svg', 2),
(5, '/images/products/classic-pique-polo-3.svg', 3),
-- Product 6
(6, '/images/products/raw-hem-oversized-tee-1.svg', 1),
(6, '/images/products/raw-hem-oversized-tee-2.svg', 2),
(6, '/images/products/raw-hem-oversized-tee-3.svg', 3),
-- Product 7
(7, '/images/products/french-linen-blend-shirt-1.svg', 1),
(7, '/images/products/french-linen-blend-shirt-2.svg', 2),
(7, '/images/products/french-linen-blend-shirt-3.svg', 3),
(7, '/images/products/french-linen-blend-shirt-4.svg', 4),
-- Product 8
(8, '/images/products/classic-oxford-button-down-1.svg', 1),
(8, '/images/products/classic-oxford-button-down-2.svg', 2),
(8, '/images/products/classic-oxford-button-down-3.svg', 3),
(8, '/images/products/classic-oxford-button-down-4.svg', 4),
-- Product 9
(9, '/images/products/heavy-flannel-check-shirt-1.svg', 1),
(9, '/images/products/heavy-flannel-check-shirt-2.svg', 2),
(9, '/images/products/heavy-flannel-check-shirt-3.svg', 3),
-- Product 10
(10, '/images/products/overdyed-denim-shirt-1.svg', 1),
(10, '/images/products/overdyed-denim-shirt-2.svg', 2),
(10, '/images/products/overdyed-denim-shirt-3.svg', 3),
-- Product 11
(11, '/images/products/camp-collar-resort-shirt-1.svg', 1),
(11, '/images/products/camp-collar-resort-shirt-2.svg', 2),
(11, '/images/products/camp-collar-resort-shirt-3.svg', 3),
-- Product 12
(12, '/images/products/slim-fit-raw-indigo-jeans-1.svg', 1),
(12, '/images/products/slim-fit-raw-indigo-jeans-2.svg', 2),
(12, '/images/products/slim-fit-raw-indigo-jeans-3.svg', 3),
(12, '/images/products/slim-fit-raw-indigo-jeans-4.svg', 4),
-- Product 13
(13, '/images/products/straight-fit-classic-blue-1.svg', 1),
(13, '/images/products/straight-fit-classic-blue-2.svg', 2),
(13, '/images/products/straight-fit-classic-blue-3.svg', 3),
-- Product 14
(14, '/images/products/relaxed-fit-carpenter-jeans-1.svg', 1),
(14, '/images/products/relaxed-fit-carpenter-jeans-2.svg', 2),
(14, '/images/products/relaxed-fit-carpenter-jeans-3.svg', 3),
-- Product 15
(15, '/images/products/tapered-fit-jet-black-jeans-1.svg', 1),
(15, '/images/products/tapered-fit-jet-black-jeans-2.svg', 2),
(15, '/images/products/tapered-fit-jet-black-jeans-3.svg', 3),
-- Product 16
(16, '/images/products/light-wash-90s-baggy-jeans-1.svg', 1),
(16, '/images/products/light-wash-90s-baggy-jeans-2.svg', 2),
(16, '/images/products/light-wash-90s-baggy-jeans-3.svg', 3),
-- Product 17
(17, '/images/products/tailored-stretch-chinos-1.svg', 1),
(17, '/images/products/tailored-stretch-chinos-2.svg', 2),
(17, '/images/products/tailored-stretch-chinos-3.svg', 3),
(17, '/images/products/tailored-stretch-chinos-4.svg', 4),
-- Product 18
(18, '/images/products/multi-pocket-cargo-pants-1.svg', 1),
(18, '/images/products/multi-pocket-cargo-pants-2.svg', 2),
(18, '/images/products/multi-pocket-cargo-pants-3.svg', 3),
-- Product 19
(19, '/images/products/pleated-formal-trousers-1.svg', 1),
(19, '/images/products/pleated-formal-trousers-2.svg', 2),
(19, '/images/products/pleated-formal-trousers-3.svg', 3),
-- Product 20
(20, '/images/products/french-terry-everyday-joggers-1.svg', 1),
(20, '/images/products/french-terry-everyday-joggers-2.svg', 2),
(20, '/images/products/french-terry-everyday-joggers-3.svg', 3),
-- Product 21
(21, '/images/products/lightweight-linen-easy-pants-1.svg', 1),
(21, '/images/products/lightweight-linen-easy-pants-2.svg', 2),
(21, '/images/products/lightweight-linen-easy-pants-3.svg', 3),
-- Product 22
(22, '/images/products/trucker-denim-jacket-1.svg', 1),
(22, '/images/products/trucker-denim-jacket-2.svg', 2),
(22, '/images/products/trucker-denim-jacket-3.svg', 3),
(22, '/images/products/trucker-denim-jacket-4.svg', 4),
-- Product 23
(23, '/images/products/ma-1-flight-bomber-jacket-1.svg', 1),
(23, '/images/products/ma-1-flight-bomber-jacket-2.svg', 2),
(23, '/images/products/ma-1-flight-bomber-jacket-3.svg', 3),
-- Product 24
(24, '/images/products/heavyweight-pullover-hoodie-1.svg', 1),
(24, '/images/products/heavyweight-pullover-hoodie-2.svg', 2),
(24, '/images/products/heavyweight-pullover-hoodie-3.svg', 3),
-- Product 25
(25, '/images/products/full-zip-track-windcheater-1.svg', 1),
(25, '/images/products/full-zip-track-windcheater-2.svg', 2),
(25, '/images/products/full-zip-track-windcheater-3.svg', 3),
-- Product 26
(26, '/images/products/minimalist-zip-up-hoodie-1.svg', 1),
(26, '/images/products/minimalist-zip-up-hoodie-2.svg', 2),
(26, '/images/products/minimalist-zip-up-hoodie-3.svg', 3),
-- Product 27
(27, '/images/products/tiered-cotton-midi-dress-1.svg', 1),
(27, '/images/products/tiered-cotton-midi-dress-2.svg', 2),
(27, '/images/products/tiered-cotton-midi-dress-3.svg', 3),
-- Product 28
(28, '/images/products/belted-utility-shirt-dress-1.svg', 1),
(28, '/images/products/belted-utility-shirt-dress-2.svg', 2),
(28, '/images/products/belted-utility-shirt-dress-3.svg', 3),
-- Product 29
(29, '/images/products/handblock-print-cotton-kurta-1.svg', 1),
(29, '/images/products/handblock-print-cotton-kurta-2.svg', 2),
(29, '/images/products/handblock-print-cotton-kurta-3.svg', 3),
(29, '/images/products/handblock-print-cotton-kurta-4.svg', 4),
-- Product 30
(30, '/images/products/short-mandarin-collar-kurta-1.svg', 1),
(30, '/images/products/short-mandarin-collar-kurta-2.svg', 2),
(30, '/images/products/short-mandarin-collar-kurta-3.svg', 3),
-- Product 31
(31, '/images/products/a-line-button-front-dress-1.svg', 1),
(31, '/images/products/a-line-button-front-dress-2.svg', 2),
(31, '/images/products/a-line-button-front-dress-3.svg', 3),
-- Product 32
(32, '/images/products/low-top-canvas-sneakers-1.svg', 1),
(32, '/images/products/low-top-canvas-sneakers-2.svg', 2),
(32, '/images/products/low-top-canvas-sneakers-3.svg', 3),
-- Product 33
(33, '/images/products/everyday-knit-running-shoes-1.svg', 1),
(33, '/images/products/everyday-knit-running-shoes-2.svg', 2),
(33, '/images/products/everyday-knit-running-shoes-3.svg', 3),
-- Product 34
(34, '/images/products/suede-penny-loafers-1.svg', 1),
(34, '/images/products/suede-penny-loafers-2.svg', 2),
(34, '/images/products/suede-penny-loafers-3.svg', 3),
-- Product 35
(35, '/images/products/moulded-comfort-slides-1.svg', 1),
(35, '/images/products/moulded-comfort-slides-2.svg', 2),
(35, '/images/products/moulded-comfort-slides-3.svg', 3),
-- Product 36
(36, '/images/products/6-panel-twill-baseball-cap-1.svg', 1),
(36, '/images/products/6-panel-twill-baseball-cap-2.svg', 2),
(36, '/images/products/6-panel-twill-baseball-cap-3.svg', 3),
-- Product 37
(37, '/images/products/minimalist-canvas-backpack-1.svg', 1),
(37, '/images/products/minimalist-canvas-backpack-2.svg', 2),
(37, '/images/products/minimalist-canvas-backpack-3.svg', 3),
-- Product 38
(38, '/images/products/minimal-bauhaus-analog-watch-1.svg', 1),
(38, '/images/products/minimal-bauhaus-analog-watch-2.svg', 2),
(38, '/images/products/minimal-bauhaus-analog-watch-3.svg', 3),
-- Product 39
(39, '/images/products/full-grain-leather-belt-1.svg', 1),
(39, '/images/products/full-grain-leather-belt-2.svg', 2),
(39, '/images/products/full-grain-leather-belt-3.svg', 3),
-- Product 40
(40, '/images/products/polarized-acetate-sunglasses-1.svg', 1),
(40, '/images/products/polarized-acetate-sunglasses-2.svg', 2),
(40, '/images/products/polarized-acetate-sunglasses-3.svg', 3);

-- =========================================================================
-- 6. COUPONS
-- =========================================================================
INSERT INTO coupons (id, code, discount_type, discount_value, min_order_value, max_discount, is_active, expires_at) VALUES
(1, 'FIRST100', 'FLAT', 100.00, 500.00, 100.00, TRUE, '2030-12-31 23:59:59'),
(2, 'THREAD15', 'PERCENTAGE', 15.00, 1200.00, 300.00, TRUE, '2030-12-31 23:59:59'),
(3, 'FESTIVE20', 'PERCENTAGE', 20.00, 2000.00, 500.00, TRUE, '2030-12-31 23:59:59');

