import { query } from '../config/database.js';

export class Module {
  static async findByCourseId(courseId) {
    const result = await query(
      `SELECT * FROM modules 
       WHERE course_id = $1 
       ORDER BY order_index ASC, created_at ASC`,
      [courseId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM modules WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async create({ courseId, title, description = '', orderIndex }) {
    const result = await query(
      `INSERT INTO modules (course_id, title, description, order_index)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [courseId, title, description, orderIndex || 0]
    );
    return result.rows[0];
  }

  static async update(id, { title, description, orderIndex }) {
    const result = await query(
      `UPDATE modules 
       SET title = $1, description = $2, order_index = $3
       WHERE id = $4
       RETURNING *`,
      [title, description, orderIndex, id]
    );
    return result.rows[0] || null;
  }

  static async delete(id) {
    const result = await query(
      'DELETE FROM modules WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  static async updateOrder(updates) {
    // updates is an array of { id, orderIndex }
    // Note: This requires a transaction, using query for simplicity
    // In production, consider using pool.transaction if available
    for (const { id, orderIndex } of updates) {
      await query(
        'UPDATE modules SET order_index = $1 WHERE id = $2',
        [orderIndex, id]
      );
    }
    return true;
  }
}

