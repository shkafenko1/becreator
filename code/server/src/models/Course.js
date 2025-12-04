import { query } from '../config/database.js';

export class Course {
  static async findByAdminId(adminId) {
    const result = await query(
      'SELECT * FROM courses WHERE admin_id = $1',
      [adminId]
    );
    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM courses WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async create({ adminId, title, description = '' }) {
    const result = await query(
      `INSERT INTO courses (admin_id, title, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [adminId, title, description]
    );
    return result.rows[0];
  }

  static async update(id, { title, description }) {
    const result = await query(
      `UPDATE courses 
       SET title = $1, description = $2
       WHERE id = $3
       RETURNING *`,
      [title, description, id]
    );
    return result.rows[0] || null;
  }

  static async findByStudentId(studentId) {
    const result = await query(
      `SELECT c.* FROM courses c
       JOIN student_enrollments se ON c.id = se.course_id
       WHERE se.student_id = $1
       LIMIT 1`,
      [studentId]
    );
    return result.rows[0] || null;
  }
}


