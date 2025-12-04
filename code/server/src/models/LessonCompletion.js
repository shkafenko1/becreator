import { query } from '../config/database.js';

export class LessonCompletion {
  static async markComplete(studentId, lessonId) {
    const result = await query(
      `INSERT INTO lesson_completions (student_id, lesson_id)
       VALUES ($1, $2)
       ON CONFLICT (student_id, lesson_id) DO NOTHING
       RETURNING *`,
      [studentId, lessonId]
    );
    return result.rows[0] || null;
  }

  static async markIncomplete(studentId, lessonId) {
    const result = await query(
      'DELETE FROM lesson_completions WHERE student_id = $1 AND lesson_id = $2 RETURNING *',
      [studentId, lessonId]
    );
    return result.rows[0] || null;
  }

  static async getProgress(studentId, courseId) {
    const result = await query(
      `SELECT 
         COUNT(DISTINCT l.id) as total_lessons,
         COUNT(DISTINCT lc.lesson_id) as completed_lessons
       FROM lessons l
       JOIN modules m ON l.module_id = m.id
       LEFT JOIN lesson_completions lc ON l.id = lc.lesson_id AND lc.student_id = $1
       WHERE m.course_id = $2`,
      [studentId, courseId]
    );

    const { total_lessons, completed_lessons } = result.rows[0];
    const total = parseInt(total_lessons) || 0;
    const completed = parseInt(completed_lessons) || 0;

    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }
}


