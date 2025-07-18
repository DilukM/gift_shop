import { ContactRepository } from "../interfaces/ContactRepository.js";
import { ContactMessage } from "../../domain/entities/ContactMessage.js";
import { pool } from "../database/connection.js";

export class PostgresContactRepository extends ContactRepository {
  async create(messageData) {
    const query = `
      INSERT INTO contact_messages (
        id, name, email, phone, message, type, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      messageData.id,
      messageData.name,
      messageData.email,
      messageData.phone,
      messageData.message,
      messageData.type || "general",
      messageData.status || "new",
    ];

    const result = await pool.query(query, values);
    return this._mapToContactMessage(result.rows[0]);
  }

  async findById(id) {
    const query = "SELECT * FROM contact_messages WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows.length > 0
      ? this._mapToContactMessage(result.rows[0])
      : null;
  }

  async findAll({ page, limit, status, type, startDate, endDate } = {}) {
    let query = "SELECT * FROM contact_messages WHERE 1=1";
    const values = [];
    let valueIndex = 1;

    if (status) {
      query += ` AND status = $${valueIndex}`;
      values.push(status);
      valueIndex++;
    }

    if (type) {
      query += ` AND type = $${valueIndex}`;
      values.push(type);
      valueIndex++;
    }

    if (startDate) {
      query += ` AND created_at >= $${valueIndex}`;
      values.push(startDate);
      valueIndex++;
    }

    if (endDate) {
      query += ` AND created_at <= $${valueIndex}`;
      values.push(endDate);
      valueIndex++;
    }

    query += " ORDER BY created_at DESC";

    if (limit) {
      query += ` LIMIT $${valueIndex}`;
      values.push(limit);
      valueIndex++;

      if (page) {
        const offset = (page - 1) * limit;
        query += ` OFFSET $${valueIndex}`;
        values.push(offset);
      }
    }

    const result = await pool.query(query, values);
    return result.rows.map((row) => this._mapToContactMessage(row));
  }

  async update(id, updateData) {
    const fields = [];
    const values = [];
    let valueIndex = 1;

    if (updateData.status !== undefined) {
      fields.push(`status = $${valueIndex}`);
      values.push(updateData.status);
      valueIndex++;
    }

    if (updateData.adminNotes !== undefined) {
      fields.push(`admin_notes = $${valueIndex}`);
      values.push(updateData.adminNotes);
      valueIndex++;
    }

    if (updateData.reply !== undefined) {
      fields.push(`reply = $${valueIndex}`);
      values.push(updateData.reply);
      valueIndex++;
    }

    if (updateData.repliedAt !== undefined) {
      fields.push(`replied_at = $${valueIndex}`);
      values.push(updateData.repliedAt);
      valueIndex++;
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE contact_messages 
      SET ${fields.join(", ")}
      WHERE id = $${valueIndex}
      RETURNING *
    `;

    values.push(id);

    const result = await pool.query(query, values);
    return result.rows.length > 0
      ? this._mapToContactMessage(result.rows[0])
      : null;
  }

  async delete(id) {
    const query = "DELETE FROM contact_messages WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  async getContactStatistics(period = "30d") {
    const query = `
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_messages,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_messages,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_messages,
        COUNT(CASE WHEN type = 'general' THEN 1 END) as general_inquiries,
        COUNT(CASE WHEN type = 'support' THEN 1 END) as support_requests,
        COUNT(CASE WHEN type = 'complaint' THEN 1 END) as complaints,
        COUNT(CASE WHEN type = 'suggestion' THEN 1 END) as suggestions
      FROM contact_messages
      WHERE created_at >= CURRENT_DATE - INTERVAL '${period.replace(
        "d",
        " days"
      )}'
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }

  async markAsRead(id) {
    const query = `
      UPDATE contact_messages 
      SET status = 'read', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status = 'new'
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows.length > 0
      ? this._mapToContactMessage(result.rows[0])
      : null;
  }

  _mapToContactMessage(row) {
    return new ContactMessage({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      type: row.type,
      status: row.status,
      adminNotes: row.admin_notes,
      reply: row.reply,
      repliedAt: row.replied_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
