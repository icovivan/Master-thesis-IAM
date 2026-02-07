import express from 'express';
import authController from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/me - Get current logged-in user (protected route)
router.get('/me', requireAuth, authController.getCurrentUser);

export default router;