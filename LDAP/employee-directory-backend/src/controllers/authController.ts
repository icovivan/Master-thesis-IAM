import { Request, Response } from 'express';
import ldapService from '../services/ldapService';

class AuthController {
  // POST /api/auth/login
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({ 
          error: 'Bad Request',
          message: 'Username and password are required' 
        });
      }

      // Authenticate against LDAP
      const user = await ldapService.authenticateUser(username, password);

      if (!user) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Invalid username or password' 
        });
      }

      // Create session
      req.session.userId = user.uid;
      req.session.user = user;

      // Save session before sending response
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ 
            error: 'Internal Server Error',
            message: 'Failed to create session' 
          });
        }

        // Return user data (without sensitive info)
        res.json({
          message: 'Login successful',
          user: {
            uid: user.uid,
            name: user.cn,
            email: user.mail,
            department: user.departmentNumber,
            title: user.title,
          },
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'An error occurred during login' 
      });
    }
  }

  // POST /api/auth/logout
  async logout(req: Request, res: Response) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Logout error:', err);
          return res.status(500).json({ 
            error: 'Internal Server Error',
            message: 'Failed to logout' 
          });
        }

        res.clearCookie('connect.sid'); // Clear session cookie
        res.json({ message: 'Logout successful' });
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'An error occurred during logout' 
      });
    }
  }

  // GET /api/auth/me - Get current user info
  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Not logged in' 
        });
      }

      const user = req.session.user;

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
        message: 'An error occurred while fetching user data' 
      });
    }
  }
}

export default new AuthController();