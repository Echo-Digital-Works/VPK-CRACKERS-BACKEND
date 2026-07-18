import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  discount: { type: String, default: '' },
  img: { type: String, required: true },
  desc: { type: String, required: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
