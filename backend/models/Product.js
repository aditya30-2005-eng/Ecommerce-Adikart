// backend/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  
  // FIX: Disabling indexing for long Base64 strings (critical for image URLs)
  imageUrl: { type: String, required: true, index: false }, 
  
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;