import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  phone: string;
  email?: string;
  place?: string;
  message: string;
  type: 'contact' | 'product' | 'offer';
  cartItems?: Array<{ name: string; price: string; quantity: number; total: number }>;
  cartTotal?: number;
  status: 'pending' | 'delivered' | 'completed';
  createdAt: Date;
}

const EnquirySchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: false },
  place: { type: String, required: false },
  message: { type: String, required: true },
  type: { type: String, enum: ['contact', 'product', 'offer'], default: 'contact' },
  cartItems: [{
    name: String,
    price: String,
    quantity: Number,
    total: Number
  }],
  cartTotal: { type: Number },
  status: { type: String, enum: ['pending', 'delivered', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
