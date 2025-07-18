import { ICartRepository } from "../../domain/repositories/index.js";
import { Cart, CartItem } from "../../domain/entities/Cart.js";
import { Product } from "../../domain/entities/Product.js";
import { query, transaction } from "../database/connection.js";

export class PostgresCartRepository extends ICartRepository {
  async findByUserId(userId) {
    if (!userId) return null;

    const result = await query(
      `
      SELECT 
        c.*,
        ci.id as item_id,
        ci.product_id,
        ci.quantity,
        ci.price as item_price,
        ci.created_at as item_created_at,
        ci.updated_at as item_updated_at,
        p.name as product_name,
        p.slug as product_slug,
        p.description as product_description,
        p.price as product_price,
        p.original_price as product_original_price,
        p.images as product_images,
        p.stock_count as product_stock_count,
        p.is_active as product_is_active,
        cat.name as category_name,
        cat.slug as category_slug
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      LEFT JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE c.user_id = $1
      ORDER BY ci.created_at ASC
    `,
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this._buildCartFromRows(result.rows);
  }

  async findBySessionId(sessionId) {
    if (!sessionId) return null;

    const result = await query(
      `
      SELECT 
        c.*,
        ci.id as item_id,
        ci.product_id,
        ci.quantity,
        ci.price as item_price,
        ci.created_at as item_created_at,
        ci.updated_at as item_updated_at,
        p.name as product_name,
        p.slug as product_slug,
        p.description as product_description,
        p.price as product_price,
        p.original_price as product_original_price,
        p.images as product_images,
        p.stock_count as product_stock_count,
        p.is_active as product_is_active,
        cat.name as category_name,
        cat.slug as category_slug
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      LEFT JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE c.session_id = $1
      ORDER BY ci.created_at ASC
    `,
      [sessionId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this._buildCartFromRows(result.rows);
  }

  async create(cartData) {
    const { userId, sessionId } = cartData;

    const result = await query(
      `
      INSERT INTO carts (user_id, session_id)
      VALUES ($1, $2)
      RETURNING *
    `,
      [userId, sessionId]
    );

    return Cart.fromDatabase(result.rows[0], []);
  }

  async addItem(cartId, productId, quantity, price) {
    return await transaction(async (client) => {
      // Check if item already exists
      const existingItem = await client.query(
        `
        SELECT * FROM cart_items 
        WHERE cart_id = $1 AND product_id = $2
      `,
        [cartId, productId]
      );

      if (existingItem.rows.length > 0) {
        // Update existing item
        const newQuantity = existingItem.rows[0].quantity + quantity;
        await client.query(
          `
          UPDATE cart_items 
          SET quantity = $1, updated_at = CURRENT_TIMESTAMP
          WHERE cart_id = $2 AND product_id = $3
        `,
          [newQuantity, cartId, productId]
        );
      } else {
        // Insert new item
        await client.query(
          `
          INSERT INTO cart_items (cart_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4)
        `,
          [cartId, productId, quantity, price]
        );
      }

      // Update cart timestamp
      await client.query(
        `
        UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1
      `,
        [cartId]
      );

      // Return updated cart
      const cartResult = await client.query(
        `
        SELECT 
          c.*,
          ci.id as item_id,
          ci.product_id,
          ci.quantity,
          ci.price as item_price,
          ci.created_at as item_created_at,
          ci.updated_at as item_updated_at,
          p.name as product_name,
          p.slug as product_slug,
          p.description as product_description,
          p.price as product_price,
          p.original_price as product_original_price,
          p.images as product_images,
          p.stock_count as product_stock_count,
          p.is_active as product_is_active,
          cat.name as category_name,
          cat.slug as category_slug
        FROM carts c
        LEFT JOIN cart_items ci ON c.id = ci.cart_id
        LEFT JOIN products p ON ci.product_id = p.id
        LEFT JOIN categories cat ON p.category_id = cat.id
        WHERE c.id = $1
        ORDER BY ci.created_at ASC
      `,
        [cartId]
      );

      return this._buildCartFromRows(cartResult.rows);
    });
  }

  async updateItemQuantity(cartId, productId, quantity) {
    const result = await query(
      `
      UPDATE cart_items 
      SET quantity = $1, updated_at = CURRENT_TIMESTAMP
      WHERE cart_id = $2 AND product_id = $3
      RETURNING *
    `,
      [quantity, cartId, productId]
    );

    if (result.rows.length === 0) {
      throw new Error("Cart item not found");
    }

    // Update cart timestamp
    await query(
      `
      UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1
    `,
      [cartId]
    );

    return this._getCartById(cartId);
  }

  async removeItem(cartId, productId) {
    const result = await query(
      `
      DELETE FROM cart_items 
      WHERE cart_id = $1 AND product_id = $2
      RETURNING *
    `,
      [cartId, productId]
    );

    if (result.rows.length === 0) {
      throw new Error("Cart item not found");
    }

    // Update cart timestamp
    await query(
      `
      UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1
    `,
      [cartId]
    );

    return this._getCartById(cartId);
  }

  async clear(cartId) {
    await query(
      `
      DELETE FROM cart_items WHERE cart_id = $1
    `,
      [cartId]
    );

    // Update cart timestamp
    await query(
      `
      UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1
    `,
      [cartId]
    );

    return this._getCartById(cartId);
  }

  async delete(cartId) {
    const result = await query(
      `
      DELETE FROM carts WHERE id = $1 RETURNING *
    `,
      [cartId]
    );

    return result.rows.length > 0;
  }

  // Helper methods
  async _getCartById(cartId) {
    const result = await query(
      `
      SELECT 
        c.*,
        ci.id as item_id,
        ci.product_id,
        ci.quantity,
        ci.price as item_price,
        ci.created_at as item_created_at,
        ci.updated_at as item_updated_at,
        p.name as product_name,
        p.slug as product_slug,
        p.description as product_description,
        p.price as product_price,
        p.original_price as product_original_price,
        p.images as product_images,
        p.stock_count as product_stock_count,
        p.is_active as product_is_active,
        cat.name as category_name,
        cat.slug as category_slug
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      LEFT JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE c.id = $1
      ORDER BY ci.created_at ASC
    `,
      [cartId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this._buildCartFromRows(result.rows);
  }

  _buildCartFromRows(rows) {
    if (rows.length === 0) return null;

    const cartRow = rows[0];
    const cart = Cart.fromDatabase(cartRow, []);

    // Build cart items
    const items = [];
    for (const row of rows) {
      if (row.item_id) {
        const product = new Product({
          id: row.product_id,
          name: row.product_name,
          slug: row.product_slug,
          description: row.product_description,
          price: row.product_price,
          originalPrice: row.product_original_price,
          images: row.product_images || [],
          stockCount: row.product_stock_count,
          isActive: row.product_is_active,
          category: row.category_name
            ? {
                name: row.category_name,
                slug: row.category_slug,
              }
            : null,
        });

        const cartItem = new CartItem({
          id: row.item_id,
          cartId: row.id,
          productId: row.product_id,
          product: product,
          quantity: row.quantity,
          price: row.item_price,
          createdAt: row.item_created_at,
          updatedAt: row.item_updated_at,
        });

        items.push(cartItem);
      }
    }

    cart.items = items;
    return cart;
  }
}
