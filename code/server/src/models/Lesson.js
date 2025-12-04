import { query } from '../config/database.js';

export class Lesson {
  static async findByModuleId(moduleId) {
    const result = await query(
      `SELECT * FROM lessons 
       WHERE module_id = $1 
       ORDER BY order_index ASC, created_at ASC`,
      [moduleId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM lessons WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async create({ moduleId, title, description = '', videoUrl = '', content = '', orderIndex }) {
    const result = await query(
      `INSERT INTO lessons (module_id, title, description, video_url, content, order_index)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [moduleId, title, description, videoUrl, content, orderIndex || 0]
    );
    return result.rows[0];
  }

  static async update(id, { title, description, videoUrl, content, orderIndex }) {
    const result = await query(
      `UPDATE lessons 
       SET title = $1, description = $2, video_url = $3, content = $4, order_index = $5
       WHERE id = $6
       RETURNING *`,
      [title, description, videoUrl, content, orderIndex, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id) {
    const result = await query(
      'DELETE FROM lessons WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  static async getLessonWithFiles(lessonId) {
    const lessonResult = await query(
      'SELECT * FROM lessons WHERE id = $1',
      [lessonId]
    );
    
    if (!lessonResult.rows[0]) {
      return null;
    }

    const filesResult = await query(
      'SELECT * FROM lesson_files WHERE lesson_id = $1 ORDER BY created_at ASC',
      [lessonId]
    );

    return {
      ...lessonResult.rows[0],
      files: filesResult.rows
    };
  }

  static async getCourseStructure(courseId, studentId = null) {
    const modulesResult = await query(
      `SELECT * FROM modules 
       WHERE course_id = $1 
       ORDER BY order_index ASC, created_at ASC`,
      [courseId]
    );

    const modules = modulesResult.rows;
    const structure = [];

    for (const module of modules) {
      const lessonsResult = await query(
        `SELECT l.*, 
                CASE WHEN lc.id IS NOT NULL THEN true ELSE false END as is_completed
         FROM lessons l
         LEFT JOIN lesson_completions lc ON l.id = lc.lesson_id AND lc.student_id = $2
         WHERE l.module_id = $1
         ORDER BY l.order_index ASC, l.created_at ASC`,
        [module.id, studentId]
      );

      structure.push({
        ...module,
        lessons: lessonsResult.rows
      });
    }

    return structure;
  }
}


