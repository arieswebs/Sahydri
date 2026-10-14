-- ==============================================================================
-- SAHYDRI ORGANICS - COMPLETE PRODUCTION DATABASE SCHEMA & SEED DATA
-- Database Name: `u192670038_sahydri`
-- Platform: Hostinger MySQL / phpMyAdmin 5.x / MariaDB 10.x
-- Encoding: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ------------------------------------------------------------------------------
-- 1. Table structure for table `users`
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    `phone` VARCHAR(30) DEFAULT '',
    `address` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_users_email` (`email`),
    KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Table structure for table `products`
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `subname` VARCHAR(200) DEFAULT '',
    `category` VARCHAR(50) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `original_price` DECIMAL(10, 2) NOT NULL,
    `weight` VARCHAR(50) DEFAULT 'Standard',
    `weights` TEXT DEFAULT NULL,
    `rating` DECIMAL(3, 2) DEFAULT 5.00,
    `reviews_count` INT DEFAULT 0,
    `stock` INT DEFAULT 50,
    `tag` VARCHAR(50) DEFAULT '',
    `type_tag` VARCHAR(50) DEFAULT '',
    `origin_badge` VARCHAR(50) DEFAULT '',
    `image` VARCHAR(500) DEFAULT '',
    `images` TEXT DEFAULT NULL,
    `description` TEXT DEFAULT NULL,
    `elevation` VARCHAR(100) DEFAULT '',
    `harvest_season` VARCHAR(100) DEFAULT '',
    `aroma_profile` VARCHAR(200) DEFAULT '',
    `curcumin_or_oil` VARCHAR(200) DEFAULT '',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_products_category` (`category`),
    KEY `idx_products_price` (`price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Table structure for table `orders`
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(100) NOT NULL,
    `customer_name` VARCHAR(120) NOT NULL,
    `customer_email` VARCHAR(191) NOT NULL,
    `customer_phone` VARCHAR(30) DEFAULT '',
    `items` JSON NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    `address` TEXT NOT NULL,
    `pincode` VARCHAR(10) DEFAULT '',
    `estimated_delivery` VARCHAR(100) DEFAULT '',
    `payment_method` VARCHAR(50) DEFAULT 'Razorpay',
    `razorpay_order_id` VARCHAR(100) DEFAULT '',
    `razorpay_payment_id` VARCHAR(100) DEFAULT '',
    `shipway_order_id` VARCHAR(100) DEFAULT '',
    `shipway_tracking_url` VARCHAR(500) DEFAULT '',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_orders_customer_email` (`customer_email`),
    KEY `idx_orders_status` (`status`),
    KEY `idx_orders_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Table structure for table `coupons`
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `coupons` (
    `code` VARCHAR(50) NOT NULL,
    `discount` DECIMAL(10, 2) NOT NULL,
    `type` ENUM('percent', 'flat') NOT NULL DEFAULT 'percent',
    `min_order` DECIMAL(10, 2) DEFAULT 0.00,
    `times_used` INT DEFAULT 0,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. Table structure for table `reviews`
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
    `id` VARCHAR(50) NOT NULL,
    `product_id` VARCHAR(100) NOT NULL,
    `customer_name` VARCHAR(120) NOT NULL,
    `rating` INT NOT NULL DEFAULT 5,
    `comment` TEXT DEFAULT NULL,
    `verified` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_reviews_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. Table structure for table `otp_codes`
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `otp_codes` (
    `email` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(10) NOT NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. Table structure for table `store_settings` (Razorpay & Store Configuration)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `store_settings` (
    `key_name` VARCHAR(100) NOT NULL,
    `key_value` TEXT DEFAULT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- SEED DATA: Store Settings & Razorpay Gateway Configuration
-- ==============================================================================

INSERT INTO `store_settings` (`key_name`, `key_value`) VALUES
('razorpay_key_id', ''),
('razorpay_key_secret', ''),
('razorpay_webhook_secret', ''),
('razorpay_mode', 'test'),
('razorpay_enabled', '1')
ON DUPLICATE KEY UPDATE `key_name` = VALUES(`key_name`);

-- ==============================================================================
-- SEED DATA: Users
-- ==============================================================================

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `address`) VALUES
('USR-001', 'Admin Sahydri', 'care@sahydriorganics.com', '$2b$12$/E0ZrGwqE0x55Z0omcxvEuS2ucnasMwxpB6EHll5UhBi7x2r50UDS', 'admin', '+91 94471 23456', 'Sahydri Organics Estate HQ, Meppadi, Wayanad – 673577'),
('USR-002', 'Admin Sahydri', 'admin@sahydriorganics.com', '$2b$12$/E0ZrGwqE0x55Z0omcxvEuS2ucnasMwxpB6EHll5UhBi7x2r50UDS', 'admin', '+91 94471 23456', 'Sahydri Organics Estate HQ, Meppadi, Wayanad – 673577'),
('USR-003', 'Admin Sahydri', 'admin@sahyadri.com', '$2b$12$/E0ZrGwqE0x55Z0omcxvEuS2ucnasMwxpB6EHll5UhBi7x2r50UDS', 'admin', '+91 94471 23456', 'Sahydri Organics Estate HQ, Meppadi, Wayanad – 673577'),
('USR-004', 'Priya Sharma', 'priya@example.com', '$2b$12$e8y10fE/w4u6uB6v5G3vfe3W29rP1aJ33q1mD6bK4vS8w6p7n8r6u', 'customer', '+91 98400 12345', '12A, MG Road, Bangalore – 560001'),
('USR-005', 'Rahul Nair', 'rahul@example.com', '$2b$12$e8y10fE/w4u6uB6v5G3vfe3W29rP1aJ33q1mD6bK4vS8w6p7n8r6u', 'customer', '+91 98400 67890', '45, Palarivattom, Ernakulam – 682025')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `password` = VALUES(`password`);

-- ==============================================================================
-- SEED DATA: All 12 Authentic Sahydri Organics Products
-- ==============================================================================

INSERT INTO `products` (`id`, `name`, `subname`, `category`, `price`, `original_price`, `weight`, `rating`, `reviews_count`, `stock`, `tag`, `type_tag`, `origin_badge`, `image`, `description`, `elevation`, `harvest_season`, `aroma_profile`, `curcumin_or_oil`) VALUES
('cardamom-elaichi-8mm', 'Green Cardamom (Elaichi) 8mm+', 'Premium Bold Grade Pods', 'spices', 474.00, 520.00, '100g', 4.90, 189, 48, 'EXTRA BOLD', 'WHOLE', '8MM+ GRADE', '/images/products/cardamom_sahydri.jpg', 'Sun-dried in high-altitude misted hills. Hand-sorted 8mm+ green cardamom pods with intense aroma and high essential oils.', '3,800 ft', 'September – December', 'Intensely floral, eucalyptus, citrus sweetness', '8.5% Volatile Oil Content'),
('pepper-whole-black', 'Whole Black Pepper – Strong & Aromatic', 'Sun-Dried Bold Malabar Pepper', 'spices', 414.00, 460.00, '250g', 4.80, 212, 72, 'HIGH PIPERINE', 'WHOLE', 'MALABAR COAST', '/images/products/pepper_sahydri.jpg', 'Authentic whole black peppercorns from the Western Ghats. Left to vine-ripen naturally for robust pungency and warm citrus finish.', '2,200 ft', 'January – March', 'Sharp pungency, woody cedar, citrus warmth', '4.8% Piperine Content'),
('turmeric-pure-natural', 'Pure & Natural Turmeric Powder', 'High Curcumin Golden Spice', 'powders', 719.00, 800.00, '1kg', 4.90, 245, 60, 'HIGH CURCUMIN', 'GROUND', 'UNPOLISHED', '/images/products/turmeric_sahydri.jpg', 'Rich golden yellow turmeric cold-milled from raw rhizomes. Retains natural healing oils and exceptionally high curcumin concentration.', '1,800 ft', 'February – April', 'Deep earthy, gingery warmth, peppery notes', '5.2% Natural Curcumin Lab Verified'),
('clove-single-estate', 'Single-Estate Hand-Picked Cloves', 'High Oil Content Aromatic Cloves', 'spices', 276.00, 300.00, '100g', 4.80, 94, 35, 'ESTATE SELECT', 'WHOLE', 'HEAD-ON CROWN', '/images/products/clove_sahydri.jpg', 'Rich reddish-brown cloves with intact crowns hand-harvested from high slopes. Abundant eugenol oils released upon slight pressure.', '2,900 ft', 'December – February', 'Sweet spicy, warm eugenol, woody clove pungency', '19.2% Eugenol Essential Oil'),
('ginger-powder-dry', 'Pure Dry Ginger (Chukku) Powder', 'Sun-Dried Highland Zesty Ginger', 'powders', 260.00, 290.00, '200g', 4.70, 83, 50, 'COLD MILLED', 'GROUND', 'NO BLEACH', '/images/products/dry_ginger_sahydri.jpg', 'Made from fibrous high-grade rhizomes peeled and cured in morning sunshine. Clean spicy punch without any sulfur processing.', '2,400 ft', 'January – March', 'Crisp zesty, ginger heat, sweet background', 'Zero Sulfur & Bleach Additives'),
('cinnamon-ceylon-wayanad', 'Wayanad Ceylon Cinnamon Quills', 'Delicate Sweet True Cinnamon Quills', 'spices', 345.00, 380.00, '100g', 4.90, 116, 42, 'TRUE CEYLON', 'WHOLE', 'LOW COUMARIN', '/images/products/cinnamon_sahydri.jpg', 'Delicate soft inner bark rolled in parchment-like rolls. Truly sweet fragrant taste free from harsh liver-toxic coumarin found in cassia.', '3,100 ft', 'May – August', 'Sweet delicate, subtle citrus, woodsy perfume', 'Ultra-low Coumarin (<0.004%) Safe Daily'),
('white-pepper-creamy', 'Premium White Peppercorns', 'Fermented & Washed Creamy White Pepper', 'spices', 480.00, 530.00, '200g', 4.80, 68, 25, 'VINE RIPENED', 'WHOLE', 'DOUBLE WASHED', '/images/products/white_pepper_sahydri.jpg', 'Fully ripe berries water-steeped in mountain streams to gently remove dark skin. Imparts deep heat without coloring light sauces.', '2,100 ft', 'February – April', 'Fermented funk, clean piercing heat, white musk', 'Triple Spring Water Washed'),
('nutmeg-mace-combo', 'Whole Nutmeg with Red Mace Flower', 'High-Elevation Fresh Whole Spices', 'spices', 390.00, 430.00, '150g', 4.90, 77, 30, 'FRAGRANT MACE', 'WHOLE', 'FARM PACKED', '/images/products/nutmeg_sahydri.jpg', 'A pair of rich nutmeg kernel bundled with its vivid scarlet aril mace. Grate fresh for festive curries, desserts, and warm spiced teas.', '2,600 ft', 'June – September', 'Sweet nutmeg, fragrant mace blossom, cinnamon clove', '100% Moisture Controlled Storage'),
('wild-honey-raw', 'Raw Wild Forest Honey', 'Unheated Honey from Forest Hives', 'honey', 468.00, 520.00, '500g', 4.90, 312, 65, 'RAW & UNFILTERED', 'HONEY', 'DEEP FOREST', '/images/products/wild_honey_sahydri.jpg', 'Extracted cold from wild multi-floral forest combs. Packed with bio-active enzymes, wild pollens, and propolis without processing.', '3,500 ft', 'Summer Forage', 'Deep molasses, wildflower blossom, smoky finish', 'NMR Certified 100% Pure Raw Honey'),
('natural-honey-pure', 'Pure Natural Honey', 'Pure & Unfiltered Harvest', 'honey', 900.00, 990.00, '1kg', 4.90, 98, 40, 'UNHEATED', 'HONEY', 'RAW HARVEST', '/images/products/natural_honey_sahydri.png', 'Pure natural honey collected from bee boxes placed across organic spice and coffee plantations. Packed with live enzymes and nectar.', '3,200 ft', 'Post-Monsoon', 'Warm floral, mild caramel, silky nectar finish', 'NABL NMR Purity Lab Verified'),
('hot-processed-coconut-oil', 'Urukku Velichenna (Hot Coconut Oil)', 'Traditional Hand-Boiled Coconut Milk Oil', 'oils', 1755.00, 1950.00, '1 L', 5.00, 84, 30, 'HERITAGE RECIPE', 'OIL', 'URUKKU OIL', '/images/products/hot_coconut_oil_sahydri.png', 'Traditional Kerala Urukku Velichenna cooked slowly in heavy bronze vessels from fresh coconut milk. Unmatched purity and aroma.', 'Coast & Foothills', 'All Year', 'Toasted sweet coconut, nutty caramel aroma', 'Extracted from Fresh Milk in Bronze Urulis'),
('natural-coconut-oil', 'Natural Coconut Oil (Cold Pressed)', 'Pure & Premium Quality Cold Milled', 'oils', 360.00, 400.00, '1 L', 4.80, 167, 55, 'COLD PRESSED', 'OIL', 'MULTI-PURPOSE', '/images/products/natural_coconut_oil_sahydri.png', 'Extracted from hand-selected mature Malabar coconuts. Clear, light, non-sticky with fresh natural aroma – perfect for cooking and skincare.', 'Malabar Basin', 'All Year', 'Fresh delicate coconut, pristine clean finish', '100% Pure Cooking & Skin Oil')
ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`), 
    `price` = VALUES(`price`), 
    `original_price` = VALUES(`original_price`),
    `stock` = VALUES(`stock`),
    `aroma_profile` = VALUES(`aroma_profile`);

-- ==============================================================================
-- SEED DATA: Coupons & Promotions
-- ==============================================================================

INSERT INTO `coupons` (`code`, `discount`, `type`, `min_order`, `times_used`, `is_active`) VALUES
('SAHYDRI10', 10.00, 'percent', 0.00, 142, TRUE),
('WELCOME15', 15.00, 'percent', 499.00, 84, TRUE),
('SPICE50', 50.00, 'flat', 399.00, 36, TRUE)
ON DUPLICATE KEY UPDATE `discount` = VALUES(`discount`), `is_active` = VALUES(`is_active`);

-- ==============================================================================
-- SEED DATA: Sample Orders with Pincodes & Delivery Dates
-- ==============================================================================

INSERT INTO `orders` (`id`, `customer_name`, `customer_email`, `customer_phone`, `items`, `total`, `status`, `address`, `pincode`, `estimated_delivery`, `payment_method`, `created_at`) VALUES
('ORD-2026-0001', 'Priya Sharma', 'priya@example.com', '+91 98400 12345', '[{"productId": "cardamom-elaichi-8mm", "name": "Green Cardamom 8mm+", "price": 474, "quantity": 2, "weight": "100g"}]', 948.00, 'delivered', '12A, MG Road, Bangalore – 560001', '560001', 'Oct 14, 2026', 'UPI', '2026-10-12 10:22:00'),
('ORD-2026-0002', 'Rahul Nair', 'rahul@example.com', '+91 98400 67890', '[{"productId": "wild-honey-raw", "name": "Premium Wild Honey", "price": 468, "quantity": 1, "weight": "500g"}, {"productId": "turmeric-pure-natural", "name": "Turmeric Powder", "price": 719, "quantity": 1, "weight": "1kg"}]', 1187.00, 'processing', '45, Palarivattom, Ernakulam – 682025', '682025', 'Oct 16, 2026', 'Card', '2026-10-13 14:08:00'),
('ORD-2026-0003', 'Meena Krishnan', 'meena@example.com', '+91 94470 55443', '[{"productId": "natural-honey-pure", "name": "Premium Natural Honey", "price": 900, "quantity": 2, "weight": "1kg"}]', 1800.00, 'shipped', '8, Kammanahalli, Chennai – 600034', '600034', 'Oct 17, 2026', 'Net Banking', '2026-10-14 09:45:00'),
('ORD-2026-0004', 'Arjun Menon', 'arjun@example.com', '+91 97450 11223', '[{"productId": "hot-processed-coconut-oil", "name": "Urukku Velichenna Coconut Oil", "price": 1755, "quantity": 1, "weight": "1 L"}, {"productId": "pepper-whole-black", "name": "Whole Black Pepper", "price": 414, "quantity": 1, "weight": "250g"}]', 2169.00, 'pending', '22, Kozhikode Fort Area, Calicut – 673001', '673001', 'Oct 17, 2026', 'COD', '2026-10-14 11:30:00')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`), `total` = VALUES(`total`);

-- ==============================================================================
-- SEED DATA: Verified Customer Reviews
-- ==============================================================================

INSERT INTO `reviews` (`id`, `product_id`, `customer_name`, `rating`, `comment`, `verified`, `created_at`) VALUES
('REV-001', 'cardamom-elaichi-8mm', 'Deepa V.', 5, 'The bold size and aromatic sweetness of this cardamom is simply unbeatable. One pod flavors my entire morning tea.', TRUE, '2026-10-10 11:00:00'),
('REV-002', 'turmeric-pure-natural', 'Kavitha S.', 5, 'You can immediately tell this is pure unpolished turmeric. The golden color and natural fragrance are extraordinary.', TRUE, '2026-10-11 15:30:00'),
('REV-003', 'wild-honey-raw', 'Anand K.', 5, 'Real raw wild honey with that distinctive deep floral note. Definitely ordering the 1kg pack next.', TRUE, '2026-10-12 09:15:00'),
('REV-004', 'hot-processed-coconut-oil', 'Lakshmi P.', 5, 'Authentic traditional Urukku Velichenna. The aroma takes me right back to traditional Kerala kitchens.', TRUE, '2026-10-13 18:20:00')
ON DUPLICATE KEY UPDATE `rating` = VALUES(`rating`);
