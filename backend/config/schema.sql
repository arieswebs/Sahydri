-- ===============================================================
-- Sahyadri Naturals - Production MySQL Schema
-- ===============================================================

CREATE DATABASE IF NOT EXISTS `sahyadri_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sahyadri_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(191) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    `phone` VARCHAR(30) DEFAULT '',
    `address` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE IF NOT EXISTS `products` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `subname` VARCHAR(200) DEFAULT '',
    `category` VARCHAR(50) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `original_price` DECIMAL(10, 2) NOT NULL,
    `weight` VARCHAR(50) DEFAULT 'Standard',
    `rating` DECIMAL(3, 2) DEFAULT 5.00,
    `reviews_count` INT DEFAULT 0,
    `stock` INT DEFAULT 0,
    `tag` VARCHAR(50) DEFAULT '',
    `type_tag` VARCHAR(50) DEFAULT '',
    `origin_badge` VARCHAR(50) DEFAULT '',
    `image` VARCHAR(500) DEFAULT '',
    `description` TEXT DEFAULT NULL,
    `elevation` VARCHAR(100) DEFAULT '',
    `harvest_season` VARCHAR(100) DEFAULT '',
    `aroma_profile` VARCHAR(200) DEFAULT '',
    `curcumin_or_oil` VARCHAR(200) DEFAULT '',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_products_category` (`category`),
    INDEX `idx_products_price` (`price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `customer_name` VARCHAR(120) NOT NULL,
    `customer_email` VARCHAR(191) NOT NULL,
    `items` JSON NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    `address` TEXT NOT NULL,
    `payment_method` VARCHAR(50) DEFAULT 'Razorpay',
    `razorpay_order_id` VARCHAR(100) DEFAULT '',
    `razorpay_payment_id` VARCHAR(100) DEFAULT '',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_orders_customer_email` (`customer_email`),
    INDEX `idx_orders_status` (`status`),
    INDEX `idx_orders_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Admin OTP / Session Table
CREATE TABLE IF NOT EXISTS `otp_codes` (
    `email` VARCHAR(191) NOT NULL PRIMARY KEY,
    `otp` VARCHAR(10) NOT NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
