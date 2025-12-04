import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { specs, swaggerUi } from './config/swagger.js';

import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import studentRoutes from './routes/student.js';
import siteRoutes from './routes/site.js';

dotenv.config();

const app = express();

// Disable HTTP caching for API responses to ensure Angular always receives fresh JSON
app.set('etag', false);
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  next();
});

app.use(helmet());

// CORS configuration:
// - In production: use explicit CLIENT_URL
// - In development: reflect request origin (useful for localhost:4200 Angular dev server)
const corsOptions = process.env.NODE_ENV === 'production'
  ? {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  : {
      origin: true,
      credentials: true
    };

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'FullStack App API Documentation'
}));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/site', siteRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to BeCreator API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      admin: '/api/admin',
      student: '/api/student',
      site: '/api/site',
      swagger: '/api-docs'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    available_routes: {
      root: 'GET /',
      health: 'GET /api/health',
      auth: 'POST /api/auth/register, POST /api/auth/login, GET /api/auth/me',
      admin: '/api/admin/* (requires admin auth)',
      student: '/api/student/* (requires student auth)',
      documentation: 'GET /api-docs'
    }
  });
});

app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

export default app;