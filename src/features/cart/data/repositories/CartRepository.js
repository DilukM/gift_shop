import { Cart, CartItem } from "../../domain/entities/Cart.js";

/**
 * Cart Repository
 * Handles cart data persistence with localStorage
 */
export class CartRepository {
  constructor() {
    this.storageKey = "giftbloom_cart";
  }

  /**
   * Load cart from localStorage
   * @returns {Promise<Cart>} Cart instance
   */
  async loadCart() {
    try {
      const cartData = localStorage.getItem(this.storageKey);
      if (!cartData) {
        return new Cart();
      }

      const parsedData = JSON.parse(cartData);
      const cartItems = parsedData.items || [];

      return new Cart(cartItems);
    } catch (error) {
      console.error("Error loading cart from storage:", error);
      return new Cart();
    }
  }

  /**
   * Save cart to localStorage
   * @param {Cart} cart Cart instance to save
   * @returns {Promise<boolean>} Success status
   */
  async saveCart(cart) {
    try {
      const cartData = JSON.stringify(cart.toJSON());
      localStorage.setItem(this.storageKey, cartData);
      return true;
    } catch (error) {
      console.error("Error saving cart to storage:", error);
      return false;
    }
  }

  /**
   * Clear cart from localStorage
   * @returns {Promise<boolean>} Success status
   */
  async clearCart() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error("Error clearing cart from storage:", error);
      return false;
    }
  }

  /**
   * Add item to cart
   * @param {Product} product Product to add
   * @param {number} quantity Quantity to add
   * @returns {Promise<Cart>} Updated cart
   */
  async addItem(product, quantity = 1) {
    try {
      const cart = await this.loadCart();
      cart.addItem(product, quantity);
      await this.saveCart(cart);
      return cart;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw new Error("Failed to add item to cart");
    }
  }

  /**
   * Remove item from cart
   * @param {string} productId Product ID to remove
   * @returns {Promise<Cart>} Updated cart
   */
  async removeItem(productId) {
    try {
      const cart = await this.loadCart();
      cart.removeItem(productId);
      await this.saveCart(cart);
      return cart;
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw new Error("Failed to remove item from cart");
    }
  }

  /**
   * Update item quantity
   * @param {string} productId Product ID
   * @param {number} quantity New quantity
   * @returns {Promise<Cart>} Updated cart
   */
  async updateQuantity(productId, quantity) {
    try {
      const cart = await this.loadCart();
      cart.updateQuantity(productId, quantity);
      await this.saveCart(cart);
      return cart;
    } catch (error) {
      console.error("Error updating item quantity:", error);
      throw new Error("Failed to update item quantity");
    }
  }

  /**
   * Get cart summary
   * @returns {Promise<Object>} Cart summary
   */
  async getCartSummary() {
    try {
      const cart = await this.loadCart();
      return cart.getSummary();
    } catch (error) {
      console.error("Error getting cart summary:", error);
      throw new Error("Failed to get cart summary");
    }
  }

  /**
   * Check if product is in cart
   * @param {string} productId Product ID to check
   * @returns {Promise<boolean>} True if product is in cart
   */
  async isProductInCart(productId) {
    try {
      const cart = await this.loadCart();
      return cart.items.some((item) => item.id === productId);
    } catch (error) {
      console.error("Error checking if product is in cart:", error);
      return false;
    }
  }

  /**
   * Get item quantity in cart
   * @param {string} productId Product ID
   * @returns {Promise<number>} Quantity in cart (0 if not found)
   */
  async getItemQuantity(productId) {
    try {
      const cart = await this.loadCart();
      const item = cart.items.find((item) => item.id === productId);
      return item ? item.quantity : 0;
    } catch (error) {
      console.error("Error getting item quantity:", error);
      return 0;
    }
  }
}
