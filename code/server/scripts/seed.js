import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Override DATABASE_URL if not set correctly
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('username')) {
      process.env.DATABASE_URL = 'postgresql://yahor:password123@localhost:5432/becreator';
    }
    
    const email = process.env.ADMIN_EMAIL || 'admin@becreator.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const fullName = process.env.ADMIN_NAME || 'Admin User';

    // Import query after setting DATABASE_URL
    const { query } = await import('../src/config/database.js');

    // Check if admin already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const userResult = await query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, 'admin')
       RETURNING id`,
      [email, passwordHash, fullName]
    );

    const adminId = userResult.rows[0].id;

    // Create course for admin
    await query(
      `INSERT INTO courses (admin_id, title, description)
       VALUES ($1, 'My Course', 'Course description')`,
      [adminId]
    );

    // Create site settings
    await query(
      `INSERT INTO site_settings (admin_id)
       VALUES ($1)`,
      [adminId]
    );

    console.log('✅ Admin user created successfully');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin().then(() => {
  console.log('Seeding completed');
  process.exit(0);
});

