import express from 'express';
import { authenticate, requireStudent } from '../middleware/auth.js';
import {
  getCourseStructure,
  getLesson,
  markLessonComplete,
  markLessonIncomplete,
  getProgress
} from '../controllers/studentController.js';

const router = express.Router();

// All routes require student authentication
router.use(authenticate);
router.use(requireStudent);

// Course structure
router.get('/course', getCourseStructure);

// Lesson viewing
router.get('/lessons/:id', getLesson);

// Progress tracking
router.post('/lessons/:id/complete', markLessonComplete);
router.post('/lessons/:id/incomplete', markLessonIncomplete);
router.get('/progress', getProgress);

export default router;


