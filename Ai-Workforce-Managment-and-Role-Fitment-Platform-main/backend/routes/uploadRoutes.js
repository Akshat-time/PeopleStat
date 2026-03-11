import express from 'express';
import { uploadJD, uploadCV, uploadActivity, uploadEmployeeData, getUploadStats, getSuggestedMappings, uploadMiddleware } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All upload routes require authentication
router.use(protect);

// Get upload statistics
router.get('/', getUploadStats);

// Get suggested mappings for employee data (preview/mapping phase)
router.post('/employee/suggest-mappings', uploadMiddleware, getSuggestedMappings);

// Upload job description
router.post('/jd', uploadMiddleware, uploadJD);

// Upload CV
router.post('/cv', uploadMiddleware, uploadCV);

// Upload activity data
router.post('/activity', uploadMiddleware, uploadActivity);

// Upload employee data
router.post('/employee', uploadMiddleware, uploadEmployeeData);

export default router;
