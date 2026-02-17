import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import employeesRoutes from './routes/employeesRoutes';
import profileRoutes from './routes/profileRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
    credentials: true,
  })
);

// Routes
app.use('/api/employees', employeesRoutes);
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Employee Directory API (Phase 2 - Keycloak) is running',
    keycloak: {
      url: process.env.KEYCLOAK_URL,
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 Keycloak: ${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`);
  console.log(`🔗 LDAP URL: ${process.env.LDAP_URL}`);
});