import { Request, Response } from 'express';
import Offer from '../models/Offer';

// Predefined modern gradients to randomly choose from
const GRADIENTS = [
  "from-brand-orange to-red-600",
  "from-brand-gold to-brand-orange",
  "from-purple-600 to-brand-orange",
  "from-blue-600 to-teal-500",
  "from-pink-500 to-rose-500"
];

// Get all offers
export const getOffers = async (req: Request, res: Response) => {
  try {
    const { activeOnly } = req.query;
    const query = activeOnly === 'true' ? { isActive: true } : {};
    
    const offers = await Offer.find(query).sort({ createdAt: -1 });
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch offers', error });
  }
};

// Create a new offer
export const createOffer = async (req: Request, res: Response) => {
  try {
    const { title, discount, description, image, gradient, price, discountPrice, products, isActive } = req.body;
    
    // Auto-choose a gradient if not provided
    const selectedGradient = gradient || GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

    const newOffer = new Offer({
      title,
      discount,
      description,
      image,
      price,
      discountPrice,
      products,
      gradient: selectedGradient,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create offer', error });
  }
};

// Update an offer
export const updateOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    
    const updatedOffer = await Offer.findByIdAndUpdate(id, updatedData, { new: true });
    
    if (!updatedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update offer', error });
  }
};

// Delete an offer
export const deleteOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedOffer = await Offer.findByIdAndDelete(id);
    
    if (!deletedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete offer', error });
  }
};
