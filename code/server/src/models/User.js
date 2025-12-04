import { query } from '../config/database.js';

export class User {
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, email, full_name, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async create({ email, passwordHash, fullName, role = 'student' }) {
    const result = await query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role, created_at, updated_at`,
      [email, passwordHash, fullName, role]
    );
    return result.rows[0];
  }

  static async getStudentsByCourse(courseId) {
    const result = await query(
      `SELECT u.id, u.email, u.full_name, u.created_at,
              COUNT(DISTINCT lc.lesson_id) as completed_lessons,
              (SELECT COUNT(*) FROM lessons l 
               JOIN modules m ON l.module_id = m.id 
               WHERE m.course_id = $1) as total_lessons
       FROM users u
       JOIN student_enrollments se ON u.id = se.student_id
       LEFT JOIN lesson_completions lc ON u.id = lc.student_id
       LEFT JOIN lessons l ON lc.lesson_id = l.id
       LEFT JOIN modules m ON l.module_id = m.id AND m.course_id = $1
       WHERE se.course_id = $1 AND u.role = 'student'
       GROUP BY u.id, u.email, u.full_name, u.created_at
       ORDER BY u.created_at DESC`,
      [courseId]
    );
    return result.rows.map(row => ({
      ...row,
      completed_lessons: parseInt(row.completed_lessons) || 0,
      total_lessons: parseInt(row.total_lessons) || 0,
      progress: row.total_lessons > 0 
        ? Math.round((row.completed_lessons / row.total_lessons) * 100) 
        : 0
    }));
  }

  static async enrollStudent(studentId, courseId) {
    const result = await query(
      `INSERT INTO student_enrollments (student_id, course_id)
       VALUES ($1, $2)
       ON CONFLICT (student_id, course_id) DO NOTHING
       RETURNING *`,
      [studentId, courseId]
    );
    return result.rows[0] || null;
  }
}


