import express from 'express';
import employeesController from '../controllers/employeesController';
import { requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

// All employee routes require authentication
router.use(requireAuth);

// GET /api/employees - Get all employees
router.get('/', employeesController.getAllEmployees);

// GET /api/employees/:uid - Get single employee
router.get('/:uid', employeesController.getEmployeeByUid);

export default router;