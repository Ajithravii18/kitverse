import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Product } from '../server/models.js';

dotenv.config();

const DRY_RUN = process.argv.includes('--dry-run');

async function migrate() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected to MongoDB. Dry run: ${DRY_RUN}`);

  const products = await Product.find({});
  let updatedCount = 0;

  for (const product of products) {
    let needsUpdate = false;

    // Set productType if not present or invalid
    if (!product.productType || !['jersey', 'shorts', 'track-pants'].includes(product.productType)) {
      product.productType = 'jersey';
      needsUpdate = true;
    }

    if (needsUpdate) {
      console.log(`Updating product: ${product.slug} to productType: ${product.productType}`);
      updatedCount++;
      if (!DRY_RUN) {
        await product.save();
      }
    }
  }

  console.log(`\nMigration complete. ${DRY_RUN ? 'Would have updated' : 'Updated'} ${updatedCount} products.`);
  await mongoose.disconnect();
}

migrate().catch(console.error);
