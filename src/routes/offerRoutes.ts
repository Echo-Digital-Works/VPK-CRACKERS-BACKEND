import express from 'express';
import { getOffers, createOffer, updateOffer, deleteOffer } from '../controllers/offerController';

const router = express.Router();

// GET all offers (pass ?activeOnly=true to get only active ones)
router.get('/', getOffers);

// POST a new offer
router.post('/', createOffer);

// PUT update an offer by ID
router.put('/:id', updateOffer);

// DELETE an offer by ID
router.delete('/:id', deleteOffer);

export default router;
