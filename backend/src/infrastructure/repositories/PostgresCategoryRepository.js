import { ICategoryRepository } from "../../domain/repositories/index.js";
import { Category } from "../../domain/entities/index.js";
import { query } from "../database/connection.js";

export class PostgresCategoryRepository extends ICategoryRepository {
  async findAll() {
    const result = await query(`
      SELECT * FROM categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC, name ASC
    `);

    return result.rows.map((row) => Category.fromDatabase(row));
  }

  async findById(id) {
    const result = await query(
      `
      SELECT * FROM categories WHERE id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return Category.fromDatabase(result.rows[0]);
  }

  async findBySlug(slug) {
    const result = await query(
      `
      SELECT * FROM categories WHERE slug = $1 AND is_active = true
    `,
      [slug]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return Category.fromDatabase(result.rows[0]);
  }

  async create(categoryData) {
    const {
      name,
      slug,
      description,
      imageUrl,
      isActive = true,
      sortOrder = 0,
    } = categoryData;

    const result = await query(
      `
      INSERT INTO categories (name, slug, description, image_url, is_active, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [name, slug, description, imageUrl, isActive, sortOrder]
    );

    return Category.fromDatabase(result.rows[0]);
  }

  async update(id, categoryData) {
    const updates = [];
    const values = [];
    let paramCount = 0;

    Object.entries(categoryData).forEach(([key, value]) => {
      if (value !== undefined) {
        paramCount++;
        const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        updates.push(`${dbKey} = $${paramCount}`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const result = await query(
      `
      UPDATE categories 
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount + 1}
      RETURNING *
    `,
      values
    );

    if (result.rows.length === 0) {
      throw new Error("Category not found");
    }

    return Category.fromDatabase(result.rows[0]);
  }

  async delete(id) {
    const result = await query(
      `
      DELETE FROM categories WHERE id = $1 RETURNING *
    `,
      [id]
    );

    return result.rows.length > 0;
  }
}
