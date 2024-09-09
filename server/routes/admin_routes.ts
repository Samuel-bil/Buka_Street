import express from 'express';
import { getAdminDashboard, getUsersWithActivityStats, getAllOrderStats, getBukaStats} from '../handlers/admin_handler';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getAdminDashboard);


// Fetch all users - Admin access only
router.get('/users', protect, authorize('admin'), getUsersWithActivityStats);

// Fetch all bukas - Admin access only
router.get('/bukas', protect, authorize('admin'), getBukaStats);

// Fetch all orders - Admin access only
router.get('/orders', protect, authorize('admin'), getAllOrderStats);

export default router;
