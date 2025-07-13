import { CartRepository } from "../../data/repositories/CartRepository.js";

/**
 * Add Item to Cart Use Case
 * Business logic for adding items to shopping cart
 */
export class AddItemToCartUseCase {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  /**
   * Execute the use case
   * @param {Product} product Product to add
   * @param {number} quantity Quantity to add
   * @returns {Promise<Object>} Result with cart and success status
   */
  async execute(product, quantity = 1) {
    try {
      // Business validations
      if (!product) {
        throw new Error("Product is required");
      }

      if (!product.inStock) {
        throw new Error("Product is out of stock");
      }

      if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      if (quantity > 10) {
        throw new Error("Maximum quantity per item is 10");
      }

      // Check current quantity in cart
      const currentQuantity = await this.cartRepository.getItemQuantity(
        product.id
      );
      const totalQuantity = currentQuantity + quantity;

      if (totalQuantity > 10) {
        throw new Error("Maximum quantity per item is 10");
      }

      const cart = await this.cartRepository.addItem(product, quantity);

      return {
        success: true,
        cart,
        message: `${product.name} added to cart`,
        addedQuantity: quantity,
        totalQuantity,
      };
    } catch (error) {
      console.error("AddItemToCartUseCase error:", error);
      return {
        success: false,
        error: error.message,
        cart: await this.cartRepository.loadCart(),
      };
    }
  }
}

/**
 * Remove Item from Cart Use Case
 * Business logic for removing items from shopping cart
 */
export class RemoveItemFromCartUseCase {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  /**
   * Execute the use case
   * @param {string} productId Product ID to remove
   * @returns {Promise<Object>} Result with cart and success status
   */
  async execute(productId) {
    try {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const cart = await this.cartRepository.removeItem(productId);

      return {
        success: true,
        cart,
        message: "Item removed from cart",
      };
    } catch (error) {
      console.error("RemoveItemFromCartUseCase error:", error);
      return {
        success: false,
        error: error.message,
        cart: await this.cartRepository.loadCart(),
      };
    }
  }
}

/**
 * Update Cart Item Quantity Use Case
 * Business logic for updating item quantities in cart
 */
export class UpdateCartItemQuantityUseCase {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  /**
   * Execute the use case
   * @param {string} productId Product ID
   * @param {number} quantity New quantity
   * @returns {Promise<Object>} Result with cart and success status
   */
  async execute(productId, quantity) {
    try {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      if (quantity < 0) {
        throw new Error("Quantity cannot be negative");
      }

      if (quantity > 10) {
        throw new Error("Maximum quantity per item is 10");
      }

      const cart = await this.cartRepository.updateQuantity(
        productId,
        quantity
      );

      return {
        success: true,
        cart,
        message: quantity === 0 ? "Item removed from cart" : "Quantity updated",
      };
    } catch (error) {
      console.error("UpdateCartItemQuantityUseCase error:", error);
      return {
        success: false,
        error: error.message,
        cart: await this.cartRepository.loadCart(),
      };
    }
  }
}

/**
 * Get Cart Use Case
 * Business logic for retrieving cart contents
 */
export class GetCartUseCase {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  /**
   * Execute the use case
   * @returns {Promise<Object>} Cart with additional business data
   */
  async execute() {
    try {
      const cart = await this.cartRepository.loadCart();
      const summary = cart.getSummary();

      // Business logic: Calculate additional data
      const estimatedTax = summary.totalPrice * 0.08; // 8% tax
      const shippingCost = summary.totalPrice > 50 ? 0 : 9.99; // Free shipping over $50
      const finalTotal = summary.totalPrice + estimatedTax + shippingCost;

      return {
        cart,
        summary: {
          ...summary,
          estimatedTax,
          shippingCost,
          finalTotal,
          formattedEstimatedTax: `$${estimatedTax.toFixed(2)}`,
          formattedShippingCost: `$${shippingCost.toFixed(2)}`,
          formattedFinalTotal: `$${finalTotal.toFixed(2)}`,
          qualifiesForFreeShipping: summary.totalPrice > 50,
          amountForFreeShipping: Math.max(0, 50 - summary.totalPrice),
        },
      };
    } catch (error) {
      console.error("GetCartUseCase error:", error);
      throw error;
    }
  }
}

/**
 * Clear Cart Use Case
 * Business logic for clearing the entire cart
 */
export class ClearCartUseCase {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  /**
   * Execute the use case
   * @returns {Promise<Object>} Result with success status
   */
  async execute() {
    try {
      await this.cartRepository.clearCart();

      return {
        success: true,
        message: "Cart cleared successfully",
      };
    } catch (error) {
      console.error("ClearCartUseCase error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

/**
 * Validate Cart Use Case
 * Business logic for validating cart before checkout
 */
export class ValidateCartUseCase {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  /**
   * Execute the use case
   * @returns {Promise<Object>} Validation result
   */
  async execute() {
    try {
      const { cart, summary } = await new GetCartUseCase().execute();

      const validationErrors = [];

      // Business validations
      if (cart.isEmpty()) {
        validationErrors.push("Cart is empty");
      }

      // Check stock availability (in real app, this would check with inventory service)
      const outOfStockItems = cart.items.filter(
        (item) => !item.product.inStock
      );
      if (outOfStockItems.length > 0) {
        validationErrors.push(
          `Some items are out of stock: ${outOfStockItems
            .map((item) => item.product.name)
            .join(", ")}`
        );
      }

      // Check minimum order amount
      if (summary.totalPrice < 10) {
        validationErrors.push("Minimum order amount is $10.00");
      }

      return {
        isValid: validationErrors.length === 0,
        errors: validationErrors,
        cart,
        summary,
      };
    } catch (error) {
      console.error("ValidateCartUseCase error:", error);
      throw error;
    }
  }
}
