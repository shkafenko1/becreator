import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { specs, swaggerUi } from './config/swagger.js';

import healthRoutes from './routes/health.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'FullStack App API Documentation'
}));

app.use('/api/health', healthRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to FullStack App API',
    version: '1.0.0',
    documentation: 'http://localhost:5000/api-docs',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
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
      users: 'GET/POST/PUT/DELETE /api/users',
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