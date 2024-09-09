import express from 'express';
import { protect } from '../middleware/auth';
import { createReview, getReviews } from '../handlers/review_handler';

const router = express.Router();

router.post('/', protect, createReview );
router.get('/', getReviews );

export default router;
