import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  getCourse,
  updateCourse,
  getModules,
  createModule,
  updateModule,
  deleteModule,
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getSiteSettings,
  updateSiteSettings,
  getStudents,
  enrollStudent
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// Course routes
router.get('/course', getCourse);
router.put('/course', updateCourse);

// Module routes
router.get('/modules', getModules);
router.post('/modules', createModule);
router.put('/modules/:id', updateModule);
router.delete('/modules/:id', deleteModule);

// Lesson routes
router.get('/modules/:moduleId/lessons', getLessons);
router.post('/modules/:moduleId/lessons', createLesson);
router.put('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);

// Site settings routes
router.get('/site-settings', getSiteSettings);
router.put('/site-settings', updateSiteSettings);

// Student management routes
router.get('/students', getStudents);
router.post('/students/enroll', enrollStudent);

export default router;



