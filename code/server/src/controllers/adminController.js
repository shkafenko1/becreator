import { Course } from '../models/Course.js';
import { Module } from '../models/Module.js';
import { Lesson } from '../models/Lesson.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { User } from '../models/User.js';

// Course handlers
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findByAdminId(req.user.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found for this admin'
      });
    }

    res.json({ success: true, data: { course } });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course'
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    let course = await Course.findByAdminId(req.user.id);

    if (!course) {
      course = await Course.create({
        adminId: req.user.id,
        title: title || 'My Course',
        description: description || 'Course description'
      });
    } else {
      course = await Course.update(course.id, { title, description });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: { course }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course'
    });
  }
};

// Module handlers
export const getModules = async (req, res) => {
  try {
    const course = await Course.findByAdminId(req.user.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found for this admin'
      });
    }

    const modules = await Module.findByCourseId(course.id);
    res.json({ success: true, data: { modules } });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching modules'
    });
  }
};

export const createModule = async (req, res) => {
  try {
    const { title, description, orderIndex } = req.body;
    const course = await Course.findByAdminId(req.user.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found for this admin'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const module = await Module.create({
      courseId: course.id,
      title,
      description,
      orderIndex
    });

    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: { module }
    });
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating module'
    });
  }
};

export const updateModule = async (req, res) => {
  try {
    const { title, description, orderIndex } = req.body;
    const module = await Module.update(req.params.id, {
      title,
      description,
      orderIndex
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    res.json({
      success: true,
      message: 'Module updated successfully',
      data: { module }
    });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating module'
    });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const module = await Module.delete(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    res.json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting module'
    });
  }
};

// Lesson handlers
export const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.findByModuleId(req.params.moduleId);
    res.json({ success: true, data: { lessons } });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lessons'
    });
  }
};

export const createLesson = async (req, res) => {
  try {
    const { title, description, videoUrl, content, orderIndex } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const lesson = await Lesson.create({
      moduleId: req.params.moduleId,
      title,
      description,
      videoUrl,
      content,
      orderIndex
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: { lesson }
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lesson'
    });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { title, description, videoUrl, content, orderIndex } = req.body;

    const lesson = await Lesson.update(req.params.id, {
      title,
      description,
      videoUrl,
      content,
      orderIndex
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: { lesson }
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lesson'
    });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.delete(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting lesson'
    });
  }
};

// Site settings handlers
export const getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findByAdminId(req.user.id);

    if (!settings) {
      settings = await SiteSettings.create(req.user.id);
    }

    res.json({ success: true, data: { settings } });
  } catch (error) {
    console.error('Get site settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching site settings'
    });
  }
};

export const updateSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findByAdminId(req.user.id);

    if (!settings) {
      settings = await SiteSettings.create(req.user.id);
    }

    settings = await SiteSettings.update(req.user.id, req.body || {});

    res.json({
      success: true,
      message: 'Site settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Update site settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating site settings'
    });
  }
};

// Student management handlers
export const getStudents = async (req, res) => {
  try {
    const course = await Course.findByAdminId(req.user.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found for this admin'
      });
    }

    const students = await User.getStudentsByCourse(course.id);

    res.json({ success: true, data: { students } });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students'
    });
  }
};

export const enrollStudent = async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email and full name are required'
      });
    }

    const course = await Course.findByAdminId(req.user.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found for this admin'
      });
    }

    let user = await User.findByEmail(email);

    if (!user) {
      // Create a student with a random password (should be reset via email in real app)
      const tempPassword = Math.random().toString(36).slice(-8);
      const bcrypt = await import('bcrypt');
      const passwordHash = await bcrypt.default.hash(tempPassword, 10);

      user = await User.create({
        email,
        passwordHash,
        fullName,
        role: 'student'
      });
    }

    const enrollment = await User.enrollStudent(user.id, course.id);

    res.json({
      success: true,
      message: 'Student enrolled successfully',
      data: {
        student: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        },
        enrollment
      }
    });
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enrolling student'
    });
  }
};


