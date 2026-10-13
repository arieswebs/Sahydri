// ===============================================================
// Sahyadri Naturals - MySQL Database Connection Pool & Auto-Migrate
// ===============================================================
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { products as defaultProducts, orders as defaultOrders, users as defaultUsers } from '../data/store.js';

let pool = null;
let dbConnected = false;

export const isDatabaseConnected = () => dbConnected;

export async function initDatabase() {
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = Number(process.env.DB_PORT) || 3306;
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || 'root';
    const database = process.env.DB_NAME || 'sahyadri_db';

    try {
        // 1. Establish initial connection without database selected to create it if not present
        const initConn = await mysql.createConnection({
            host,
            port,
            user,
            password,
        });

        await initConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await initConn.end();

        // 2. Create the connection pool with the database selected
        pool = mysql.createPool({
            host,
            port,
            user,
            password,
            database,
            waitForConnections: true,
            connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
            queueLimit: Number(process.env.DB_QUEUE_LIMIT) || 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });

        // 3. Create tables if not present
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(50) NOT NULL PRIMARY KEY,
                name VARCHAR(120) NOT NULL,
                email VARCHAR(191) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
                phone VARCHAR(30) DEFAULT '',
                address TEXT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_users_email (email),
                INDEX idx_users_role (role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(100) NOT NULL PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                subname VARCHAR(200) DEFAULT '',
                category VARCHAR(50) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                original_price DECIMAL(10, 2) NOT NULL,
                weight VARCHAR(50) DEFAULT 'Standard',
                rating DECIMAL(3, 2) DEFAULT 5.00,
                reviews_count INT DEFAULT 0,
                stock INT DEFAULT 0,
                tag VARCHAR(50) DEFAULT '',
                type_tag VARCHAR(50) DEFAULT '',
                origin_badge VARCHAR(50) DEFAULT '',
                image VARCHAR(500) DEFAULT '',
                description TEXT DEFAULT NULL,
                elevation VARCHAR(100) DEFAULT '',
                harvest_season VARCHAR(100) DEFAULT '',
                aroma_profile VARCHAR(200) DEFAULT '',
                curcumin_or_oil VARCHAR(200) DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_products_category (category)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(100) NOT NULL PRIMARY KEY,
                customer_name VARCHAR(120) NOT NULL,
                customer_email VARCHAR(191) NOT NULL,
                items JSON NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
                address TEXT NOT NULL,
                payment_method VARCHAR(50) DEFAULT 'Razorpay',
                razorpay_order_id VARCHAR(100) DEFAULT '',
                razorpay_payment_id VARCHAR(100) DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_orders_customer_email (customer_email),
                INDEX idx_orders_status (status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS otp_codes (
                email VARCHAR(191) NOT NULL PRIMARY KEY,
                otp VARCHAR(10) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // 4. Seed initial data if tables are empty
        await seedDatabase();

        dbConnected = true;
        console.log(`🐬 [MySQL] Successfully connected to '${database}' at ${host}:${port}`);
        return pool;
    } catch (err) {
        dbConnected = false;
        console.error(`⚠️  [MySQL] Connection failed (${err.message}). In-memory store fallback active.`);
        return null;
    }
}

/**
 * Seed initial products, users, and orders if tables are empty
 */
async function seedDatabase() {
    try {
        // Seed Users
        const [userRows] = await pool.query('SELECT COUNT(*) as count FROM users');
        if (userRows[0].count === 0) {
            console.log('🌱 [MySQL] Seeding default users...');
            for (const u of defaultUsers) {
                let hashedPass = u.password;
                if (!hashedPass.startsWith('$2')) {
                    hashedPass = await bcrypt.hash(u.password, 12);
                }
                await pool.query(`
                    INSERT INTO users (id, name, email, password, role, phone, address)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [u.id, u.name, u.email.toLowerCase(), hashedPass, u.role, u.phone || '', u.address || '']);
            }
        }

        // Seed Products
        const [prodRows] = await pool.query('SELECT COUNT(*) as count FROM products');
        if (prodRows[0].count === 0) {
            console.log('🌱 [MySQL] Seeding default products...');
            for (const p of defaultProducts) {
                await pool.query(`
                    INSERT INTO products (
                        id, name, subname, category, price, original_price, weight,
                        rating, reviews_count, stock, tag, type_tag, origin_badge,
                        image, description, elevation, harvest_season, aroma_profile, curcumin_or_oil
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    p.id, p.name, p.subname || '', p.category, p.price, p.originalPrice || p.price,
                    p.weight || 'Standard', p.rating || 5.0, p.reviewsCount || 0, p.stock || 50,
                    p.tag || '', p.typeTag || '', p.originBadge || '', p.image || '',
                    p.description || '', p.elevation || '', p.harvestSeason || '',
                    p.aromaProfile || '', p.curcuminOrOil || ''
                ]);
            }
        }

        // Seed Orders
        const [orderRows] = await pool.query('SELECT COUNT(*) as count FROM orders');
        if (orderRows[0].count === 0) {
            console.log('🌱 [MySQL] Seeding default sample orders...');
            for (const o of defaultOrders) {
                await pool.query(`
                    INSERT INTO orders (
                        id, customer_name, customer_email, items, total,
                        status, address, payment_method, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    o.id, o.customerName, o.customerEmail.toLowerCase(),
                    JSON.stringify(o.items), o.total, o.status,
                    o.address || '', o.paymentMethod || 'Razorpay',
                    o.createdAt ? new Date(o.createdAt) : new Date()
                ]);
            }
        }
    } catch (seedErr) {
        console.error('⚠️  [MySQL] Seeding error:', seedErr.message);
    }
}

/**
 * Production-ready query helper with auto fallback to in-memory store
 */
export async function query(sql, params = []) {
    if (pool && dbConnected) {
        const [rows] = await pool.query(sql, params);
        return rows;
    }
    throw new Error('Database pool not connected');
}

export { pool };
