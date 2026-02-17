import express from 'express';
import employeesController from '../controllers/employeesController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// GET /api/employees
router.get('/', employeesController.getAllEmployees);

// GET /api/employees/:uid
router.get('/:uid', employeesController.getEmployeeByUid);

export default router;