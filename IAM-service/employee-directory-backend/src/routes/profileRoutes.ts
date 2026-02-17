import express from 'express';
import employeesController from '../controllers/employeesController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

// GET /api/profile
router.get('/', requireAuth, employeesController.getCurrentUserProfile);

export default router;