export class OrderItem {
  constructor({
    id,
    productId,
    productName,
    productSlug,
    productImageUrl,
    quantity,
    unitPrice,
    totalPrice,
    product,
    createdAt = new Date(),
  }) {
    this.id = id;
    this.productId = productId;
    this.productName = productName;
    this.productSlug = productSlug;
    this.productImageUrl = productImageUrl;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.totalPrice = totalPrice;
    this.product = product;
    this.createdAt = createdAt;
  }

  validate() {
    if (!this.productId) {
      throw new Error("Product ID is required");
    }

    if (!this.quantity || this.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (!Number.isInteger(this.quantity)) {
      throw new Error("Quantity must be a whole number");
    }

    if (this.quantity > 1000) {
      throw new Error("Quantity cannot exceed 1000");
    }

    if (!this.unitPrice || this.unitPrice < 0) {
      throw new Error("Unit price must be greater than or equal to 0");
    }

    if (!Number.isFinite(this.unitPrice)) {
      throw new Error("Unit price must be a valid number");
    }

    if (!this.totalPrice || this.totalPrice < 0) {
      throw new Error("Total price must be greater than or equal to 0");
    }

    if (!Number.isFinite(this.totalPrice)) {
      throw new Error("Total price must be a valid number");
    }

    // Validate that total price matches quantity * unit price
    const expectedTotal = parseFloat(
      (this.quantity * this.unitPrice).toFixed(2)
    );
    const actualTotal = parseFloat(this.totalPrice.toFixed(2));

    if (Math.abs(expectedTotal - actualTotal) > 0.01) {
      throw new Error("Total price does not match quantity × unit price");
    }

    return true;
  }

  updateQuantity(newQuantity) {
    if (!newQuantity || newQuantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    if (!Number.isInteger(newQuantity)) {
      throw new Error("Quantity must be a whole number");
    }

    if (newQuantity > 1000) {
      throw new Error("Quantity cannot exceed 1000");
    }

    this.quantity = newQuantity;
    this.totalPrice = parseFloat((this.unitPrice * this.quantity).toFixed(2));
  }

  updateUnitPrice(newUnitPrice) {
    if (!newUnitPrice || newUnitPrice < 0) {
      throw new Error("Unit price must be greater than or equal to 0");
    }

    if (!Number.isFinite(newUnitPrice)) {
      throw new Error("Unit price must be a valid number");
    }

    this.unitPrice = newUnitPrice;
    this.totalPrice = parseFloat((this.unitPrice * this.quantity).toFixed(2));
  }

  getFormattedUnitPrice(currency = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(this.unitPrice);
  }

  getFormattedTotalPrice(currency = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(this.totalPrice);
  }

  getSavings(originalPrice) {
    if (!originalPrice || originalPrice <= this.unitPrice) {
      return 0;
    }
    return parseFloat(
      ((originalPrice - this.unitPrice) * this.quantity).toFixed(2)
    );
  }

  getFormattedSavings(originalPrice, currency = "USD") {
    const savings = this.getSavings(originalPrice);
    if (savings <= 0) {
      return null;
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(savings);
  }

  getDiscountPercentage(originalPrice) {
    if (!originalPrice || originalPrice <= this.unitPrice) {
      return 0;
    }

    return Math.round(((originalPrice - this.unitPrice) / originalPrice) * 100);
  }

  isDiscounted(originalPrice) {
    return originalPrice && originalPrice > this.unitPrice;
  }

  clone() {
    return new OrderItem({
      id: this.id,
      productId: this.productId,
      productName: this.productName,
      productSlug: this.productSlug,
      productImageUrl: this.productImageUrl,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      totalPrice: this.totalPrice,
      product: this.product ? { ...this.product } : undefined,
      createdAt: this.createdAt,
    });
  }

  equals(other) {
    if (!(other instanceof OrderItem)) {
      return false;
    }

    return (
      this.productId === other.productId &&
      this.quantity === other.quantity &&
      this.unitPrice === other.unitPrice
    );
  }

  toJSON() {
    return {
      id: this.id,
      productId: this.productId,
      productName: this.productName,
      productSlug: this.productSlug,
      productImageUrl: this.productImageUrl,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      totalPrice: this.totalPrice,
      product: this.product,
      createdAt: this.createdAt,
      formattedUnitPrice: this.getFormattedUnitPrice(),
      formattedTotalPrice: this.getFormattedTotalPrice(),
    };
  }
}
