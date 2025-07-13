/**
 * Cart Item Domain Entity
 * Represents an item in the shopping cart
 */
export class CartItem {
  constructor({ product, quantity = 1 }) {
    this.id = product.id;
    this.product = product;
    this.quantity = quantity;
  }

  /**
   * Get total price for this cart item
   * @returns {number} Total price (price * quantity)
   */
  getTotalPrice() {
    return this.product.price * this.quantity;
  }

  /**
   * Get formatted total price
   * @returns {string} Formatted total price string
   */
  getFormattedTotalPrice() {
    return `$${this.getTotalPrice().toFixed(2)}`;
  }

  /**
   * Increase quantity by specified amount
   * @param {number} amount Amount to increase (default: 1)
   */
  increaseQuantity(amount = 1) {
    this.quantity += amount;
  }

  /**
   * Decrease quantity by specified amount
   * @param {number} amount Amount to decrease (default: 1)
   */
  decreaseQuantity(amount = 1) {
    this.quantity = Math.max(0, this.quantity - amount);
  }

  /**
   * Set specific quantity
   * @param {number} quantity New quantity
   */
  setQuantity(quantity) {
    this.quantity = Math.max(0, quantity);
  }

  /**
   * Convert to plain object for storage/transfer
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      product: this.product,
      quantity: this.quantity,
      totalPrice: this.getTotalPrice(),
    };
  }
}

/**
 * Shopping Cart Domain Entity
 * Represents the entire shopping cart
 */
export class Cart {
  constructor(items = []) {
    this.items = items.map((item) =>
      item instanceof CartItem ? item : new CartItem(item)
    );
  }

  /**
   * Add product to cart
   * @param {Product} product Product to add
   * @param {number} quantity Quantity to add
   */
  addItem(product, quantity = 1) {
    console.log("Cart.addItem called with:", { product, quantity });
    const existingItem = this.items.find((item) => item.id === product.id);
    console.log("Existing item found:", existingItem);

    if (existingItem) {
      console.log("Increasing quantity for existing item");
      existingItem.increaseQuantity(quantity);
      console.log("New quantity:", existingItem.quantity);
    } else {
      console.log("Adding new item to cart");
      const newItem = new CartItem({ product, quantity });
      console.log("New cart item:", newItem);
      this.items.push(newItem);
    }

    console.log("Total items in cart:", this.items.length);
    console.log("Cart items:", this.items);
  }

  /**
   * Remove item from cart
   * @param {string} productId Product ID to remove
   */
  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
  }

  /**
   * Update item quantity
   * @param {string} productId Product ID
   * @param {number} quantity New quantity
   */
  updateQuantity(productId, quantity) {
    const item = this.items.find((item) => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.setQuantity(quantity);
      }
    }
  }

  /**
   * Clear all items from cart
   */
  clear() {
    this.items = [];
  }

  /**
   * Get total number of items in cart
   * @returns {number} Total quantity of all items
   */
  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get total price of all items
   * @returns {number} Total price
   */
  getTotalPrice() {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  /**
   * Get formatted total price
   * @returns {string} Formatted total price string
   */
  getFormattedTotalPrice() {
    return `$${this.getTotalPrice().toFixed(2)}`;
  }

  /**
   * Check if cart is empty
   * @returns {boolean} True if cart has no items
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Get cart summary
   * @returns {Object} Cart summary object
   */
  getSummary() {
    return {
      totalItems: this.getTotalItems(),
      totalPrice: this.getTotalPrice(),
      formattedTotalPrice: this.getFormattedTotalPrice(),
      isEmpty: this.isEmpty(),
      itemCount: this.items.length,
    };
  }

  /**
   * Convert to plain object for storage/transfer
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      items: this.items.map((item) => item.toJSON()),
      summary: this.getSummary(),
    };
  }
}
