import { Router } from 'express';
import { submitEnquiry, getEnquiries, updateEnquiryStatus } from '../controllers/enquiryController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// POST /api/enquiry
router.post('/', submitEnquiry);

// GET /api/enquiry (Protected)
router.get('/', protect, getEnquiries);

// PUT /api/enquiry/:id/status (Protected)
router.put('/:id/status', protect, updateEnquiryStatus);

export default router;
