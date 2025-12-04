import { Course } from '../models/Course.js';
import { Lesson } from '../models/Lesson.js';
import { LessonCompletion } from '../models/LessonCompletion.js';
import { User } from '../models/User.js';

export const getCourseStructure = async (req, res) => {
  try {
    const course = await Course.findByStudentId(req.user.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in any course'
      });
    }

    const structure = await Lesson.getCourseStructure(course.id, req.user.id);
    res.json({ success: true, data: { course, structure } });
  } catch (error) {
    console.error('Get course structure error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course structure'
    });
  }
};

export const getLesson = async (req, res) => {
  try {
    const course = await Course.findByStudentId(req.user.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in any course'
      });
    }

    const lesson = await Lesson.getLessonWithFiles(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Verify lesson belongs to student's course
    const structure = await Lesson.getCourseStructure(course.id);
    const lessonExists = structure.some(module => 
      module.lessons.some(l => l.id === parseInt(req.params.id))
    );

    if (!lessonExists) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({ success: true, data: { lesson } });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lesson'
    });
  }
};

export const markLessonComplete = async (req, res) => {
  try {
    const course = await Course.findByStudentId(req.user.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in any course'
      });
    }

    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Verify lesson belongs to student's course
    const structure = await Lesson.getCourseStructure(course.id);
    const lessonExists = structure.some(module => 
      module.lessons.some(l => l.id === parseInt(req.params.id))
    );

    if (!lessonExists) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await LessonCompletion.markComplete(req.user.id, req.params.id);
    
    const progress = await LessonCompletion.getProgress(req.user.id, course.id);
    
    res.json({
      success: true,
      message: 'Lesson marked as complete',
      data: { progress }
    });
  } catch (error) {
    console.error('Mark lesson complete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking lesson as complete'
    });
  }
};

export const markLessonIncomplete = async (req, res) => {
  try {
    const course = await Course.findByStudentId(req.user.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in any course'
      });
    }

    await LessonCompletion.markIncomplete(req.user.id, req.params.id);
    
    const progress = await LessonCompletion.getProgress(req.user.id, course.id);
    
    res.json({
      success: true,
      message: 'Lesson marked as incomplete',
      data: { progress }
    });
  } catch (error) {
    console.error('Mark lesson incomplete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking lesson as incomplete'
    });
  }
};

export const getProgress = async (req, res) => {
  try {
    const course = await Course.findByStudentId(req.user.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in any course'
      });
    }

    const progress = await LessonCompletion.getProgress(req.user.id, course.id);
    res.json({ success: true, data: { progress } });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress'
    });
  }
};



