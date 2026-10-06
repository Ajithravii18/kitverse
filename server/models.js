import mongoose from 'mongoose';
import {qualities, sizes} from '../shared/catalog.js';

const stockSchema = new mongoose.Schema(Object.fromEntries(sizes.map(size => [size, {
 type: Number, min: 0, default: 0, validate: Number.isSafeInteger
}])), {_id: false});

export const Product = mongoose.model('Product', new mongoose.Schema({
  slug: {type:String, unique:true, required:true},
  name: {type:String, required:true},
  team: String,
  productType: {type:String, enum:['jersey','shorts','track-pants','collar-tshirt'], default:'jersey'},
  retro: {type:Boolean, default:false},
  category: {type:String, enum:['club','national']},
  tag: String,
  image: String,
  images: [{url:{type:String,required:true}, label:String, _id:false}],
  quality: {type:String, enum:qualities},
  price: {type:Number, required:true, min:0, validate:Number.isFinite},
  costPrice: {type:Number, min:0, validate:Number.isSafeInteger},
  stock: {type:stockSchema, default:()=>({})},
  season: String, 
  published: {type:Boolean, default:true}, 
  featured: {type:Boolean, default:false},
  description: String, 
  specifications: [String]
}, {timestamps:true}));

export const InventoryHistory = mongoose.model('InventoryHistory', new mongoose.Schema({
  productSlug: {type: String, required: true},
  size: {type: String, required: true},
  quantityChange: {type: Number, required: true},
  reason: {type: String, required: true},
  adminUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  idempotencyKey: {type: String, required: true, unique: true},
}, {timestamps:true}));

export const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'customer'], default: 'customer' },
  permissions: [{ type: String, enum: ['inventory', 'finance', 'support', 'content'] }],
  isVerified: { type: Boolean, default: false },
  supportNotes: { type: String, default: '' },
  otp: { type: String },
  otpExpires: { type: Date },
  otpAttempts: { type: Number, default: 0 },
  otpPurpose: {type:String,enum:['verification','password-reset']}
}, { timestamps: true }));

export const Review = mongoose.model('Review', new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNotes: String,
  rewardIssued: { type: Boolean, default: false }
}, { timestamps: true }));

export const Discount = mongoose.model('Discount', new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['fixed', 'percentage'], required: true },
  value: { type: Number, required: true, min: 0 }, // Value in paise for fixed, or 0-100 for percentage
  minSpend: { type: Number, default: 0, min: 0 },
  expiry: { type: Date },
  usageLimit: { type: Number, min: 1 },
  usedCount: { type: Number, default: 0 },
  eligibleProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Empty implies all products
  active: { type: Boolean, default: true }
}, { timestamps: true }));

export const Content = mongoose.model('Content', new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  draftValue: { type: mongoose.Schema.Types.Mixed },
  publishedValue: { type: mongoose.Schema.Types.Mixed },
  history: [{
    action: { type: String, enum: ['draft_saved', 'published'] },
    adminUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true }));

const orderLineSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  name: { type: String, required: true },
  productType: { type: String, default: 'jersey' },
  quality: { type: String },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  costPrice: { type: Number },
  qty: { type: Number, required: true, min: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderRef: { type: String, required: true, unique: true },
  lines: [orderLineSchema],
  subtotal: { type: Number, required: true },
  discountCode: String,
  discountAmount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    streetAddress: { type: String, required: true },
    apartment: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postcode: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: String,
    email: { type: String, required: true },
    notes: String
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'review_required', 'partially_refunded', 'refunded', 'cancelled'], default: 'pending' },
  fulfilmentStatus: { type: String, enum: ['unfulfilled', 'packed', 'shipped', 'delivered', 'failed', 'legacy_fulfilled'], default: 'unfulfilled' },
  checkoutKey: String,
  fingerprint: String,
  expiresAt: Date,
  stockReleased: { type: Boolean, default: false },
  paymentId: String,
  paidAt: Date,
  paymentIntentId: String,
  trackingDetails: String,
  shipping: {
    courier: String,
    trackingNumber: String,
    trackingUrl: String,
    packedAt: Date,
    dispatchedAt: Date,
    deliveredAt: Date,
    exceptions: [String]
  },
  refunds: [{
    amount: Number,
    reason: String,
    providerRefundId: String,
    status: { type: String, enum: ['pending', 'processed', 'failed'] },
    idempotencyKey: String,
    adminUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now}
  }],
  returns: [{
    slug: String,
    size: String,
    qty: Number,
    reason: String,
    status: { type: String, enum: ['requested', 'approved', 'inspected', 'rejected', 'restocked'] },
    exchangeForSize: String,
    adminNotes: String,
    createdAt: {type: Date, default: Date.now}
  }],
  activityHistory: [{
    action: String,
    adminUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    timestamp: {type: Date, default: Date.now}
  }]
}, { timestamps: true });

orderSchema.index({userId:1,checkoutKey:1},{unique:true,partialFilterExpression:{checkoutKey:{$type:'string'}}});
orderSchema.index({paymentStatus:1,expiresAt:1});

export const Order = mongoose.model('Order', orderSchema);

export const Notification = mongoose.model('Notification', new mongoose.Schema({
  type: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'sent', 'failed'], default: 'pending' },
  attempts: { type: Number, default: 0 },
  lastAttemptAt: Date,
  leaseToken: String,
  leaseUntil: Date,
  nextAttemptAt: Date,
  error: String
}, { timestamps: true }));
