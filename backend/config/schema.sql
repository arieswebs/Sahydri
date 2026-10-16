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
('USR-003', 'Admin Sahydri', 'admin@sahyadri.com', '$2b$12$/E0ZrGwqE0x55Z0omcxvEuS2ucnasMwxpB6EHll5UhBi7x2r50UDS', 'admin', '+91 94471 23456', 'Sahydri Organics Estate HQ, Meppadi, Wayanad – 673577')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `password` = VALUES(`password`);

-- ==============================================================================
-- SEED DATA: Products (Clean - Empty Initial Catalog)
-- ==============================================================================

-- ==============================================================================
-- SEED DATA: Coupons & Promotions
-- ==============================================================================

INSERT INTO `coupons` (`code`, `discount`, `type`, `min_order`, `times_used`, `is_active`) VALUES
('SAHYDRI10', 10.00, 'percent', 0.00, 142, TRUE),
('WELCOME15', 15.00, 'percent', 499.00, 84, TRUE),
('SPICE50', 50.00, 'flat', 399.00, 36, TRUE)
ON DUPLICATE KEY UPDATE `discount` = VALUES(`discount`), `is_active` = VALUES(`is_active`);

-- ==============================================================================
-- SEED DATA: Sample Orders (Clean - Empty Initial State)
-- ==============================================================================

-- ==============================================================================
-- SEED DATA: Verified Customer Reviews
-- ==============================================================================

INSERT INTO `reviews` (`id`, `product_id`, `customer_name`, `rating`, `comment`, `verified`, `created_at`) VALUES
('REV-001', 'cardamom-elaichi-8mm', 'Deepa V.', 5, 'The bold size and aromatic sweetness of this cardamom is simply unbeatable. One pod flavors my entire morning tea.', TRUE, '2026-10-10 11:00:00'),
('REV-002', 'turmeric-pure-natural', 'Kavitha S.', 5, 'You can immediately tell this is pure unpolished turmeric. The golden color and natural fragrance are extraordinary.', TRUE, '2026-10-11 15:30:00'),
('REV-003', 'wild-honey-raw', 'Anand K.', 5, 'Real raw wild honey with that distinctive deep floral note. Definitely ordering the 1kg pack next.', TRUE, '2026-10-12 09:15:00'),
('REV-004', 'hot-processed-coconut-oil', 'Lakshmi P.', 5, 'Authentic traditional Urukku Velichenna. The aroma takes me right back to traditional Kerala kitchens.', TRUE, '2026-10-13 18:20:00')
ON DUPLICATE KEY UPDATE `rating` = VALUES(`rating`);
