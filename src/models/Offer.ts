import mongoose, { Document, Schema } from 'mongoose';

export interface IOffer extends Document {
  title: string;
  discount: string;
  description: string;
  gradient: string;
  image: string;
  price: string;
  discountPrice: string;
  products: Array<{
    name: string;
    category: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<IOffer>(
  {
    title: { type: String, required: true },
    discount: { type: String, required: true },
    description: { type: String, required: true },
    gradient: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    discountPrice: { type: String, required: true },
    products: [{
      name: { type: String, required: true },
      category: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      total: { type: Number, required: true }
    }],
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOffer>('Offer', offerSchema);
