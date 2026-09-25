import mongoose from 'mongoose';
import {Product} from './models.js';
import {products} from '../shared/catalog.js';
if(!process.env.MONGODB_URI)throw new Error('Set MONGODB_URI in .env before seeding.');
try{await mongoose.connect(process.env.MONGODB_URI);for(const product of products)await Product.updateOne({slug:product.slug},{$setOnInsert:product},{upsert:true});console.log('Sample catalogue added; existing products preserved.');}finally{await mongoose.disconnect()}
