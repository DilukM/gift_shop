import { IProductRepository } from "../../domain/repositories/index.js";
import { Product } from "../../domain/entities/Product.js";
import { query } from "../database/connection.js";

export class PostgresProductRepository extends IProductRepository {
  async findAll(filters = {}) {
    const {
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      featured,
      popular,
      isActive = true,
      page = 1,
      limit = 12,
      sortBy = "created_at",
    } = filters;

    let whereConditions = ["p.is_active = $1"];
    let queryParams = [isActive];
    let paramCount = 1;

    if (categoryId) {
      whereConditions.push(`p.category_id = $${++paramCount}`);
      queryParams.push(categoryId);
    }

    if (minPrice !== undefined) {
      whereConditions.push(`p.price >= $${++paramCount}`);
      queryParams.push(minPrice);
    }

    if (maxPrice !== undefined) {
      whereConditions.push(`p.price <= $${++paramCount}`);
      queryParams.push(maxPrice);
    }

    if (inStock) {
      whereConditions.push("p.stock_count > 0");
    }

    if (featured) {
      whereConditions.push("p.is_featured = true");
    }

    if (popular) {
      whereConditions.push("p.is_popular = true");
    }

    // Sorting
    let orderBy = "p.created_at DESC";
    switch (sortBy) {
      case "price_asc":
        orderBy = "p.price ASC";
        break;
      case "price_desc":
        orderBy = "p.price DESC";
        break;
      case "name":
        orderBy = "p.name ASC";
        break;
      case "rating":
        orderBy = "p.rating DESC, p.review_count DESC";
        break;
      case "popular":
        orderBy = "p.is_popular DESC, p.rating DESC";
        break;
      case "featured":
        orderBy = "p.is_featured DESC, p.created_at DESC";
        break;
    }

    // Pagination
    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${whereConditions.join(" AND ")}
    `;

    const dataQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${whereConditions.join(" AND ")}
      ORDER BY ${orderBy}
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    queryParams.push(limit, offset);

    const [countResult, dataResult] = await Promise.all([
      query(countQuery, queryParams.slice(0, -2)),
      query(dataQuery, queryParams),
    ]);

    const products = dataResult.rows.map((row) => {
      const product = Product.fromDatabase(row);
      if (row.category_name) {
        product.category = {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
        };
      }
      return product;
    });

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id) {
    const result = await query(
      `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'url', pi.image_url,
              'altText', pi.alt_text,
              'isPrimary', pi.is_primary,
              'sortOrder', pi.sort_order
            ) ORDER BY pi.sort_order
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) as image_list
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = $1
      GROUP BY p.id, c.id, c.name, c.slug
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    const product = Product.fromDatabase(row);

    if (row.category_name) {
      product.category = {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
      };
    }

    // Merge images from images column and image_list
    const imageList = row.image_list || [];
    if (imageList.length > 0) {
      product.images = imageList;
    }

    return product;
  }

  async findBySlug(slug) {
    const result = await query(
      `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1 AND p.is_active = true
    `,
      [slug]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    const product = Product.fromDatabase(row);

    if (row.category_name) {
      product.category = {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
      };
    }

    return product;
  }

  async findByCategory(categoryId, filters = {}) {
    return this.findAll({ ...filters, categoryId });
  }

  async search(searchTerm, filters = {}) {
    const {
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      featured,
      popular,
      isActive = true,
      page = 1,
      limit = 12,
      sortBy = "relevance",
    } = filters;

    let whereConditions = [
      "p.is_active = $1",
      `(
        p.name ILIKE $2 OR 
        p.description ILIKE $2 OR 
        p.tags::text ILIKE $2 OR
        p.features::text ILIKE $2
      )`,
    ];

    let queryParams = [isActive, `%${searchTerm}%`];
    let paramCount = 2;

    if (categoryId) {
      whereConditions.push(`p.category_id = $${++paramCount}`);
      queryParams.push(categoryId);
    }

    if (minPrice !== undefined) {
      whereConditions.push(`p.price >= $${++paramCount}`);
      queryParams.push(minPrice);
    }

    if (maxPrice !== undefined) {
      whereConditions.push(`p.price <= $${++paramCount}`);
      queryParams.push(maxPrice);
    }

    if (inStock) {
      whereConditions.push("p.stock_count > 0");
    }

    if (featured) {
      whereConditions.push("p.is_featured = true");
    }

    if (popular) {
      whereConditions.push("p.is_popular = true");
    }

    // Sorting with relevance
    let orderBy = "p.created_at DESC";
    switch (sortBy) {
      case "relevance":
        orderBy = `
          (CASE 
            WHEN p.name ILIKE $2 THEN 1
            WHEN p.description ILIKE $2 THEN 2
            ELSE 3
          END),
          p.rating DESC,
          p.is_featured DESC
        `;
        break;
      case "price_asc":
        orderBy = "p.price ASC";
        break;
      case "price_desc":
        orderBy = "p.price DESC";
        break;
      case "name":
        orderBy = "p.name ASC";
        break;
      case "rating":
        orderBy = "p.rating DESC, p.review_count DESC";
        break;
    }

    const offset = (page - 1) * limit;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      WHERE ${whereConditions.join(" AND ")}
    `;

    const dataQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${whereConditions.join(" AND ")}
      ORDER BY ${orderBy}
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;

    queryParams.push(limit, offset);

    const [countResult, dataResult] = await Promise.all([
      query(countQuery, queryParams.slice(0, -2)),
      query(dataQuery, queryParams),
    ]);

    const products = dataResult.rows.map((row) => {
      const product = Product.fromDatabase(row);
      if (row.category_name) {
        product.category = {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
        };
      }
      return product;
    });

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      products,
      searchTerm,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findFeatured(limit = 10) {
    const result = await query(
      `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = true AND p.is_active = true
      ORDER BY p.rating DESC, p.created_at DESC
      LIMIT $1
    `,
      [limit]
    );

    return result.rows.map((row) => {
      const product = Product.fromDatabase(row);
      if (row.category_name) {
        product.category = {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
        };
      }
      return product;
    });
  }

  async findPopular(limit = 10) {
    const result = await query(
      `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_popular = true AND p.is_active = true
      ORDER BY p.rating DESC, p.review_count DESC, p.created_at DESC
      LIMIT $1
    `,
      [limit]
    );

    return result.rows.map((row) => {
      const product = Product.fromDatabase(row);
      if (row.category_name) {
        product.category = {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
        };
      }
      return product;
    });
  }

  async create(productData) {
    const {
      name,
      slug,
      description,
      categoryId,
      price,
      originalPrice,
      sku,
      stockCount,
      isActive,
      isFeatured,
      isPopular,
      weight,
      dimensions,
      images,
      features,
      tags,
      metaTitle,
      metaDescription,
    } = productData;

    const result = await query(
      `
      INSERT INTO products (
        name, slug, description, category_id, price, original_price,
        sku, stock_count, is_active, is_featured, is_popular, weight,
        dimensions, images, features, tags, meta_title, meta_description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `,
      [
        name,
        slug,
        description,
        categoryId,
        price,
        originalPrice,
        sku,
        stockCount,
        isActive,
        isFeatured,
        isPopular,
        weight,
        JSON.stringify(dimensions),
        JSON.stringify(images),
        JSON.stringify(features),
        JSON.stringify(tags),
        metaTitle,
        metaDescription,
      ]
    );

    return Product.fromDatabase(result.rows[0]);
  }

  async update(id, productData) {
    const updates = [];
    const values = [];
    let paramCount = 0;

    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined) {
        paramCount++;
        const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();

        if (["dimensions", "images", "features", "tags"].includes(key)) {
          updates.push(`${dbKey} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          updates.push(`${dbKey} = $${paramCount}`);
          values.push(value);
        }
      }
    });

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const result = await query(
      `
      UPDATE products 
      SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount + 1}
      RETURNING *
    `,
      values
    );

    if (result.rows.length === 0) {
      throw new Error("Product not found");
    }

    return Product.fromDatabase(result.rows[0]);
  }

  async delete(id) {
    const result = await query(
      `
      DELETE FROM products WHERE id = $1 RETURNING *
    `,
      [id]
    );

    return result.rows.length > 0;
  }

  async updateStock(id, quantityChange) {
    const result = await query(
      `
      UPDATE products 
      SET stock_count = GREATEST(0, stock_count + $1),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
      [quantityChange, id]
    );

    if (result.rows.length === 0) {
      throw new Error("Product not found");
    }

    return Product.fromDatabase(result.rows[0]);
  }

  async updateRating(id, rating, reviewCount) {
    const result = await query(
      `
      UPDATE products 
      SET rating = $1, review_count = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `,
      [rating, reviewCount, id]
    );

    if (result.rows.length === 0) {
      throw new Error("Product not found");
    }

    return Product.fromDatabase(result.rows[0]);
  }
}
