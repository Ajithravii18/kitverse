import mongoose from 'mongoose';
import {qualities, sizes} from '../shared/catalog.js';
import {productTypes, styleTagsList} from '../shared/product.js';

const stockSchema = new mongoose.Schema(Object.fromEntries(sizes.map(size => [size, {
 type: Number, min: 0, default: 0, validate: Number.isSafeInteger
}])), {_id: false});

export const Product=mongoose.model('Product',new mongoose.Schema({
 slug:{type:String,unique:true,required:true},name:{type:String,required:true},team:String,
 category:{type:String,enum:['club','national'],required:true},tag:String,image:String,
 images:[{url:{type:String,required:true},label:String,_id:false}],
 quality:{
   type:String,
   validate: {
     validator: function(v) {
       if (this.productType === 'shorts' || this.productType === 'track-pants') {
         return !v || qualities.includes(v);
       }
       return qualities.includes(v);
     },
     message: 'Invalid quality'
   },
   required: function() { return this.productType === 'jersey' || !this.productType; }
 },
 productType: {type:String, enum:productTypes, default:'jersey'},
 styleTags: [{type:String, enum:styleTagsList}],
 price:{type:Number,required:true,min:0,validate:Number.isSafeInteger},
 stock:{type:stockSchema,default:()=>({})},
 season:String, published:{type:Boolean,default:true}, featured:{type:Boolean,default:false},
 description:String, specifications:[String]
},{timestamps:true}));

export const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  otpHash: { type: String },
  otpExpires: { type: Date }
}, { timestamps: true }));

const orderLineSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  name: { type: String, required: true },
  quality: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
  qty: { type: Number, required: true, min: 1, validate: Number.isSafeInteger }
}, { _id: false });

export const Order = mongoose.model('Order', new mongoose.Schema({
  orderRef: { type: String, required: true, unique: true },
  lines: [orderLineSchema],
  total: { type: Number, required: true, min: 0, validate: Number.isSafeInteger },
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
    email: { type: String, required: true, lowercase: true, trim: true },
    notes: String
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending_payment', 'paid', 'payment_review', 'fulfilled', 'cancelled'], default: 'pending_payment' },
  paymentIntentId: { type: String, sparse: true },
  trackingDetails: String,
  expiresAt: { type: Date }
}, { timestamps: true }));
