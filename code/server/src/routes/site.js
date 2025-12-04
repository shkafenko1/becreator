import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getMySiteSettings } from '../controllers/siteSettingsController.js';

const router = express.Router();

router.get('/settings', authenticate, getMySiteSettings);

export default router;

