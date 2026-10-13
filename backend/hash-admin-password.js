// Run once: node hash-admin-password.js
// Copy the output hash into backend/.env as ADMIN_PASSWORD_HASH
import bcrypt from 'bcryptjs';

const password = 'admin123'; // <-- change to your real admin password
const hash = await bcrypt.hash(password, 12);
console.log('\n✅ Admin password hash generated:');
console.log(hash);
console.log('\nPaste this value into backend/.env as:');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
