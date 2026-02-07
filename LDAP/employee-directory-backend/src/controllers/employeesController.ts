import { Request, Response } from 'express';
import ldapService from '../services/ldapService';

class EmployeesController {
  // GET /api/employees - Get all employees
  async getAllEmployees(req: Request, res: Response) {
    try {
      const users = await ldapService.getAllUsers();

      // Map to frontend-friendly format
      const employees = users.map((user) => ({
        uid: user.uid,
        name: user.cn,
        firstName: user.givenName,
        lastName: user.sn,
        email: user.mail,
        phone: user.telephoneNumber || 'N/A',
        department: user.departmentNumber || 'N/A',
        title: user.title || 'N/A',
      }));

      res.json({ employees });
    } catch (error) {
      console.error('Get all employees error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'An error occurred while fetching employees' 
      });
    }
  }

  // GET /api/employees/:uid - Get single employee by UID
  async getEmployeeByUid(req: Request, res: Response) {
    try {
      const { uid } = req.params;

      if (!uid || typeof uid !== 'string') {
        return res.status(400).json({ 
          error: 'Bad Request',
          message: 'Invalid UID parameter' 
        });
      }

      const user = await ldapService.getUserByUid(uid);

      if (!user) {
        return res.status(404).json({ 
          error: 'Not Found',
          message: 'Employee not found' 
        });
      }

      // Map to frontend-friendly format
      const employee = {
        uid: user.uid,
        name: user.cn,
        firstName: user.givenName,
        lastName: user.sn,
        email: user.mail,
        phone: user.telephoneNumber || 'N/A',
        department: user.departmentNumber || 'N/A',
        title: user.title || 'N/A',
      };

      res.json({ employee });
    } catch (error) {
      console.error('Get employee error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'An error occurred while fetching employee data' 
      });
    }
  }
}

export default new EmployeesController();