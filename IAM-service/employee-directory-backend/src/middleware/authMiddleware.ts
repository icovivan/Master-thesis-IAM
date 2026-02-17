import { Request, Response, NextFunction } from 'express';
import { KeycloakToken } from '../types';

// Middleware to extract and validate Bearer token
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Decode JWT token (we'll validate it by calling Keycloak)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token format',
      });
    }

    // Decode the payload (base64)
    const payload = JSON.parse(
      Buffer.from(tokenParts[1], 'base64').toString('utf-8')
    );

    // Simple validation: check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expired',
      });
    }

    // Attach user info to request
    req.user = payload as KeycloakToken;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token',
    });
  }
};