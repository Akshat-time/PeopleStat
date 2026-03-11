import express from 'express';
import { getRecommendations, initiateOptimization } from '../controllers/optimizationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// manager-protected endpoints
router.use(protect);
// optionally could add manager-check middleware

router.get('/', getRecommendations);
router.post('/initiate', initiateOptimization);

export default router;