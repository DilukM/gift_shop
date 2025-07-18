export class CartItem {
  constructor({
    id,
    cartId,
    productId,
    product,
    quantity,
    price,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.cartId = cartId;
    this.productId = productId;
    this.product = product;
    this.quantity = parseInt(quantity);
    this.price = parseFloat(price);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getTotalPrice() {
    return this.quantity * this.price;
  }

  updateQuantity(newQuantity) {
    if (newQuantity < 1) {
      throw new Error("Quantity must be at least 1");
    }
    this.quantity = parseInt(newQuantity);
  }

  toJSON() {
    return {
      id: this.id,
      cartId: this.cartId,
      productId: this.productId,
      product: this.product?.toJSON ? this.product.toJSON() : this.product,
      quantity: this.quantity,
      price: this.price,
      totalPrice: this.getTotalPrice(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromDatabase(row) {
    return new CartItem({
      id: row.id,
      cartId: row.cart_id,
      productId: row.product_id,
      product: row.product,
      quantity: row.quantity,
      price: row.price,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}

export class Cart {
  constructor({ id, userId, sessionId, items = [], createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;
    this.sessionId = sessionId;
    this.items = items.map((item) =>
      item instanceof CartItem ? item : new CartItem(item)
    );
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  addItem(product, quantity = 1, price = null) {
    const itemPrice = price || product.price;
    const existingItem = this.items.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      existingItem.updateQuantity(existingItem.quantity + quantity);
    } else {
      const newItem = new CartItem({
        cartId: this.id,
        productId: product.id,
        product: product,
        quantity: quantity,
        price: itemPrice,
      });
      this.items.push(newItem);
    }
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.productId !== productId);
  }

  updateItemQuantity(productId, quantity) {
    const item = this.items.find((item) => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.updateQuantity(quantity);
      }
    }
  }

  clear() {
    this.items = [];
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  calculateTax(taxRate = 0.08) {
    return this.getSubtotal() * taxRate;
  }

  calculateShipping(freeShippingThreshold = 75) {
    const subtotal = this.getSubtotal();
    return subtotal >= freeShippingThreshold ? 0 : 9.99;
  }

  getTotal(taxRate = 0.08, freeShippingThreshold = 75) {
    const subtotal = this.getSubtotal();
    const tax = this.calculateTax(taxRate);
    const shipping = this.calculateShipping(freeShippingThreshold);
    return subtotal + tax + shipping;
  }

  getSummary(taxRate = 0.08, freeShippingThreshold = 75) {
    const subtotal = this.getSubtotal();
    const tax = this.calculateTax(taxRate);
    const shipping = this.calculateShipping(freeShippingThreshold);
    const total = subtotal + tax + shipping;

    return {
      itemCount: this.getTotalItems(),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      freeShippingEligible: shipping === 0,
      freeShippingRemaining:
        shipping > 0
          ? parseFloat((freeShippingThreshold - subtotal).toFixed(2))
          : 0,
    };
  }

  isEmpty() {
    return this.items.length === 0;
  }

  validate() {
    const errors = [];

    if (this.isEmpty()) {
      errors.push("Cart is empty");
    }

    for (const item of this.items) {
      if (!item.product) {
        errors.push(`Product not found for item ${item.productId}`);
        continue;
      }

      if (!item.product.isInStock()) {
        errors.push(`${item.product.name} is out of stock`);
      }

      if (!item.product.canPurchase(item.quantity)) {
        errors.push(
          `Insufficient stock for ${item.product.name}. Available: ${item.product.stockCount}`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      sessionId: this.sessionId,
      items: this.items.map((item) => item.toJSON()),
      summary: this.getSummary(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromDatabase(row, items = []) {
    return new Cart({
      id: row.id,
      userId: row.user_id,
      sessionId: row.session_id,
      items: items,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
