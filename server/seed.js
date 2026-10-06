import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {Product, User} from './models.js';
import {products} from '../shared/catalog.js';
if(!process.env.MONGODB_URI)throw new Error('Set MONGODB_URI in .env before seeding.');
try {
  await mongoose.connect(process.env.MONGODB_URI);
  for(const product of products) {
    await Product.updateOne({slug:product.slug},{$setOnInsert:product},{upsert:true});
  }
  
  const passwordHash = await bcrypt.hash('Admin', 10);
  await User.updateOne(
    { email: 'admin@example.invalid' },
    { $setOnInsert: { email: 'admin@example.invalid', username: 'AdminUser', passwordHash, role: 'admin', isVerified: true } },
    { upsert: true }
  );

  console.log('Sample catalogue and admin added; existing items preserved.');
} finally {
  await mongoose.disconnect();
}
