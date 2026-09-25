import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../server/models.js';

if (!process.env.MONGODB_URI) {
  console.error('Set MONGODB_URI in .env before creating an admin.');
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node scripts/create-admin.mjs <email> <password>');
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const passwordHash = await bcrypt.hash(password, 10);
  await User.updateOne(
    { email },
    { $set: { passwordHash, role: 'admin' } },
    { upsert: true }
  );
  console.log(`Admin user ${email} created or updated successfully.`);
} catch (err) {
  console.error('Error creating admin:', err.message);
} finally {
  await mongoose.disconnect();
}
