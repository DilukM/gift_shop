import {
  AddItemToCartUseCase,
  RemoveItemFromCartUseCase,
  UpdateCartItemQuantityUseCase,
  GetCartUseCase,
  ClearCartUseCase,
  ValidateCartUseCase,
} from "../../domain/usecases/CartUseCases.js";

/**
 * Cart Service
 * Application layer service coordinating cart-related operations
 */
export class CartService {
  constructor() {
    this.addItemToCartUseCase = new AddItemToCartUseCase();
    this.removeItemFromCartUseCase = new RemoveItemFromCartUseCase();
    this.updateCartItemQuantityUseCase = new UpdateCartItemQuantityUseCase();
    this.getCartUseCase = new GetCartUseCase();
    this.clearCartUseCase = new ClearCartUseCase();
    this.validateCartUseCase = new ValidateCartUseCase();

    // Event listeners for cart changes
    this.cartChangeListeners = [];
  }

  /**
   * Add item to cart
   * @param {Product} product Product to add
   * @param {number} quantity Quantity to add
   * @returns {Promise<Object>} Operation result
   */
  async addItem(product, quantity = 1) {
    try {
      console.log("CartService.addItem called with:", { product, quantity });
      const result = await this.addItemToCartUseCase.execute(product, quantity);
      console.log("AddItemToCartUseCase result:", result);

      if (result.success) {
        console.log("Notifying cart change...");
        this.notifyCartChange("item_added", {
          product,
          quantity,
          cart: result.cart,
        });
      }

      return result;
    } catch (error) {
      console.error("CartService.addItem error:", error);
      throw error;
    }
  }

  /**
   * Remove item from cart
   * @param {string} productId Product ID to remove
   * @returns {Promise<Object>} Operation result
   */
  async removeItem(productId) {
    try {
      const result = await this.removeItemFromCartUseCase.execute(productId);

      if (result.success) {
        this.notifyCartChange("item_removed", { productId, cart: result.cart });
      }

      return result;
    } catch (error) {
      console.error("CartService.removeItem error:", error);
      throw error;
    }
  }

  /**
   * Update item quantity
   * @param {string} productId Product ID
   * @param {number} quantity New quantity
   * @returns {Promise<Object>} Operation result
   */
  async updateQuantity(productId, quantity) {
    try {
      const result = await this.updateCartItemQuantityUseCase.execute(
        productId,
        quantity
      );

      if (result.success) {
        this.notifyCartChange("quantity_updated", {
          productId,
          quantity,
          cart: result.cart,
        });
      }

      return result;
    } catch (error) {
      console.error("CartService.updateQuantity error:", error);
      throw error;
    }
  }

  /**
   * Get cart with calculated totals
   * @returns {Promise<Object>} Cart with summary
   */
  async getCart() {
    try {
      return await this.getCartUseCase.execute();
    } catch (error) {
      console.error("CartService.getCart error:", error);
      throw error;
    }
  }

  /**
   * Clear entire cart
   * @returns {Promise<Object>} Operation result
   */
  async clearCart() {
    try {
      const result = await this.clearCartUseCase.execute();

      if (result.success) {
        this.notifyCartChange("cart_cleared", { cart: null });
      }

      return result;
    } catch (error) {
      console.error("CartService.clearCart error:", error);
      throw error;
    }
  }

  /**
   * Validate cart for checkout
   * @returns {Promise<Object>} Validation result
   */
  async validateCart() {
    try {
      return await this.validateCartUseCase.execute();
    } catch (error) {
      console.error("CartService.validateCart error:", error);
      throw error;
    }
  }

  /**
   * Get cart summary for UI display
   * @returns {Promise<Object>} Cart summary
   */
  async getCartSummary() {
    try {
      const { summary } = await this.getCart();
      return summary;
    } catch (error) {
      console.error("CartService.getCartSummary error:", error);
      throw error;
    }
  }

  /**
   * Check if product is in cart
   * @param {string} productId Product ID
   * @returns {Promise<boolean>} True if product is in cart
   */
  async isProductInCart(productId) {
    try {
      const { cart } = await this.getCart();
      return cart.items.some((item) => item.id === productId);
    } catch (error) {
      console.error("CartService.isProductInCart error:", error);
      return false;
    }
  }

  /**
   * Get item quantity in cart
   * @param {string} productId Product ID
   * @returns {Promise<number>} Quantity in cart
   */
  async getItemQuantity(productId) {
    try {
      const { cart } = await this.getCart();
      const item = cart.items.find((item) => item.id === productId);
      return item ? item.quantity : 0;
    } catch (error) {
      console.error("CartService.getItemQuantity error:", error);
      return 0;
    }
  }

  /**
   * Process checkout
   * @param {Object} checkoutData Checkout form data
   * @returns {Promise<Object>} Checkout result
   */
  async processCheckout(checkoutData) {
    try {
      // Validate cart first
      const validation = await this.validateCart();
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors,
        };
      }

      // Validate checkout data
      const checkoutValidation = this.validateCheckoutData(checkoutData);
      if (!checkoutValidation.isValid) {
        return {
          success: false,
          errors: checkoutValidation.errors,
        };
      }

      // In a real app, this would integrate with payment processor
      // For now, simulate successful checkout
      const orderId = this.generateOrderId();

      // Clear cart after successful checkout
      await this.clearCart();

      this.notifyCartChange("checkout_completed", { orderId, checkoutData });

      return {
        success: true,
        orderId,
        message: "Order placed successfully!",
        estimatedDelivery: this.calculateEstimatedDelivery(),
      };
    } catch (error) {
      console.error("CartService.processCheckout error:", error);
      return {
        success: false,
        errors: [
          "An error occurred while processing your order. Please try again.",
        ],
      };
    }
  }

  /**
   * Validate checkout form data
   * @private
   * @param {Object} data Checkout data
   * @returns {Object} Validation result
   */
  validateCheckoutData(data) {
    const errors = [];

    if (!data.firstName?.trim()) errors.push("First name is required");
    if (!data.lastName?.trim()) errors.push("Last name is required");
    if (!data.email?.trim()) errors.push("Email is required");
    if (!data.phone?.trim()) errors.push("Phone number is required");
    if (!data.address?.trim()) errors.push("Address is required");
    if (!data.city?.trim()) errors.push("City is required");
    if (!data.zipCode?.trim()) errors.push("ZIP code is required");

    // Email validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Please enter a valid email address");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate order ID
   * @private
   * @returns {string} Order ID
   */
  generateOrderId() {
    return "GB-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Calculate estimated delivery date
   * @private
   * @returns {string} Estimated delivery date
   */
  calculateEstimatedDelivery() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 business days
    return deliveryDate.toLocaleDateString();
  }

  /**
   * Add cart change listener
   * @param {Function} listener Callback function
   */
  addCartChangeListener(listener) {
    this.cartChangeListeners.push(listener);
  }

  /**
   * Remove cart change listener
   * @param {Function} listener Callback function
   */
  removeCartChangeListener(listener) {
    this.cartChangeListeners = this.cartChangeListeners.filter(
      (l) => l !== listener
    );
  }

  /**
   * Notify cart change listeners
   * @private
   * @param {string} action Action type
   * @param {Object} data Event data
   */
  notifyCartChange(action, data) {
    this.cartChangeListeners.forEach((listener) => {
      try {
        listener({ action, ...data });
      } catch (error) {
        console.error("Error in cart change listener:", error);
      }
    });
  }
}
