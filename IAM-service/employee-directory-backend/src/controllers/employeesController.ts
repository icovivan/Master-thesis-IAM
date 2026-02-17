import { Request, Response } from 'express';
import ldapService from '../services/ldapService';

class EmployeesController {
  // GET /api/employees
  async getAllEmployees(req: Request, res: Response) {
    try {
      const users = await ldapService.getAllUsers();

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
        message: 'An error occurred while fetching employees',
      });
    }
  }

  // GET /api/employees/:uid
  async getEmployeeByUid(req: Request, res: Response) {
    try {
      const { uid } = req.params;
      
      // Ensure uid is a string, not an array
      const uidString = Array.isArray(uid) ? uid[0] : uid;

      const user = await ldapService.getUserByUid(uidString);

      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Employee not found',
        });
      }

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
        message: 'An error occurred while fetching employee data',
      });
    }
  }

  // GET /api/profile - Get current user's profile
  async getCurrentUserProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      // Get full user data from LDAP
      const user = await ldapService.getUserByUid(req.user.preferred_username);

      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found in directory',
        });
      }

      res.json({
        user: {
          uid: user.uid,
          name: user.cn,
          firstName: user.givenName,
          lastName: user.sn,
          email: user.mail,
          phone: user.telephoneNumber,
          department: user.departmentNumber,
          title: user.title,
        },
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching user profile',
      });
    }
  }
}

export default new EmployeesController();