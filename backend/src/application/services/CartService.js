import {
  GetCartUseCase,
  AddItemToCartUseCase,
  UpdateCartItemQuantityUseCase,
  RemoveItemFromCartUseCase,
  ClearCartUseCase,
  ValidateCartUseCase,
} from "../../domain/usecases/CartUseCases.js";

export class CartService {
  constructor(cartRepository, productRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;

    // Initialize use cases
    this.getCartUseCase = new GetCartUseCase(cartRepository, productRepository);
    this.addItemToCartUseCase = new AddItemToCartUseCase(
      cartRepository,
      productRepository
    );
    this.updateCartItemQuantityUseCase = new UpdateCartItemQuantityUseCase(
      cartRepository,
      productRepository
    );
    this.removeItemFromCartUseCase = new RemoveItemFromCartUseCase(
      cartRepository
    );
    this.clearCartUseCase = new ClearCartUseCase(cartRepository);
    this.validateCartUseCase = new ValidateCartUseCase(
      cartRepository,
      productRepository
    );
  }

  async getOrCreateCart(userId, sessionId) {
    try {
      let cart = null;

      if (userId) {
        cart = await this.cartRepository.findByUserId(userId);
      } else if (sessionId) {
        cart = await this.cartRepository.findBySessionId(sessionId);
      }

      if (!cart) {
        cart = await this.cartRepository.create({ userId, sessionId });
      }

      return cart;
    } catch (error) {
      throw new Error(`Failed to get or create cart: ${error.message}`);
    }
  }

  async getCart(userId, sessionId) {
    try {
      return await this.getOrCreateCart(userId, sessionId);
    } catch (error) {
      throw new Error(`Failed to get cart: ${error.message}`);
    }
  }

  async addItemToCart(userId, sessionId, productId, quantity = 1) {
    try {
      const cart = await this.getOrCreateCart(userId, sessionId);
      return await this.addItemToCartUseCase.execute(
        cart.id,
        productId,
        quantity
      );
    } catch (error) {
      throw new Error(`Failed to add item to cart: ${error.message}`);
    }
  }

  async updateItemQuantity(userId, sessionId, productId, quantity) {
    try {
      const cart = await this.getOrCreateCart(userId, sessionId);
      return await this.updateCartItemQuantityUseCase.execute(
        cart.id,
        productId,
        quantity
      );
    } catch (error) {
      throw new Error(`Failed to update item quantity: ${error.message}`);
    }
  }

  async removeItemFromCart(userId, sessionId, productId) {
    try {
      const cart = await this.getOrCreateCart(userId, sessionId);
      return await this.removeItemFromCartUseCase.execute(cart.id, productId);
    } catch (error) {
      throw new Error(`Failed to remove item from cart: ${error.message}`);
    }
  }

  async clearCart(userId, sessionId) {
    try {
      const cart = await this.getOrCreateCart(userId, sessionId);
      return await this.clearCartUseCase.execute(cart.id);
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }

  async validateCart(userId, sessionId) {
    try {
      const cart = await this.getOrCreateCart(userId, sessionId);

      if (!cart || cart.isEmpty()) {
        return {
          isValid: false,
          errors: ["Cart is empty"],
        };
      }

      // Validate each item
      const errors = [];
      const updatedItems = [];

      for (const item of cart.items) {
        const product = await this.productRepository.findById(item.productId);

        if (!product) {
          errors.push(
            `Product ${item.product?.name || item.productId} no longer exists`
          );
          continue;
        }

        if (!product.isActive) {
          errors.push(`${product.name} is no longer available`);
          continue;
        }

        if (!product.isInStock()) {
          errors.push(`${product.name} is out of stock`);
          continue;
        }

        if (product.stockCount < item.quantity) {
          errors.push(
            `Only ${product.stockCount} units of ${product.name} available (requested: ${item.quantity})`
          );
          // Optionally auto-adjust quantity
          item.quantity = product.stockCount;
          updatedItems.push(item);
        }

        // Check for price changes
        if (product.price !== item.price) {
          errors.push(
            `Price of ${product.name} has changed from $${item.price} to $${product.price}`
          );
          // Optionally update price
          item.price = product.price;
          updatedItems.push(item);
        }
      }

      // Update items if needed
      for (const item of updatedItems) {
        await this.updateItemQuantity(
          userId,
          sessionId,
          item.productId,
          item.quantity
        );
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings:
          updatedItems.length > 0
            ? ["Some items were updated due to availability or price changes"]
            : [],
      };
    } catch (error) {
      throw new Error(`Failed to validate cart: ${error.message}`);
    }
  }

  async getCartSummary(userId, sessionId) {
    try {
      const cart = await this.getOrCreateCart(userId, sessionId);
      return cart.getSummary();
    } catch (error) {
      throw new Error(`Failed to get cart summary: ${error.message}`);
    }
  }

  async isProductInCart(userId, sessionId, productId) {
    try {
      const cart = await this.getOrCreateCart(userId, sessionId);
      return cart.items.some((item) => item.productId === productId);
    } catch (error) {
      return false;
    }
  }

  async getItemQuantity(userId, sessionId, productId) {
    try {
      const cart = await this.getOrCreateCart(userId, sessionId);
      const item = cart.items.find((item) => item.productId === productId);
      return item ? item.quantity : 0;
    } catch (error) {
      return 0;
    }
  }

  async mergeGuestCartWithUserCart(guestSessionId, userId) {
    try {
      const guestCart = await this.cartRepository.findBySessionId(
        guestSessionId
      );
      if (!guestCart || guestCart.isEmpty()) {
        return null;
      }

      let userCart = await this.cartRepository.findByUserId(userId);
      if (!userCart) {
        // Transfer guest cart to user
        userCart = await this.cartRepository.create({ userId });
      }

      // Merge items
      for (const guestItem of guestCart.items) {
        const existingItem = userCart.items.find(
          (item) => item.productId === guestItem.productId
        );

        if (existingItem) {
          // Update quantity
          const newQuantity = existingItem.quantity + guestItem.quantity;
          await this.cartRepository.updateItemQuantity(
            userCart.id,
            guestItem.productId,
            newQuantity
          );
        } else {
          // Add new item
          await this.cartRepository.addItem(
            userCart.id,
            guestItem.productId,
            guestItem.quantity,
            guestItem.price
          );
        }
      }

      // Delete guest cart
      await this.cartRepository.delete(guestCart.id);

      // Return merged cart
      return await this.cartRepository.findByUserId(userId);
    } catch (error) {
      throw new Error(`Failed to merge carts: ${error.message}`);
    }
  }

  async calculateShippingOptions(userId, sessionId, address = null) {
    try {
      const cart = await this.getOrCreateCart(userId, sessionId);
      const summary = cart.getSummary();

      // Basic shipping options
      const options = [
        {
          id: "standard",
          name: "Standard Shipping",
          description: "5-7 business days",
          price: summary.subtotal >= 75 ? 0 : 9.99,
          estimatedDays: 7,
        },
        {
          id: "express",
          name: "Express Shipping",
          description: "2-3 business days",
          price: summary.subtotal >= 100 ? 15.99 : 19.99,
          estimatedDays: 3,
        },
        {
          id: "overnight",
          name: "Overnight Shipping",
          description: "Next business day",
          price: 29.99,
          estimatedDays: 1,
        },
      ];

      // If address is provided, could calculate based on location
      // For now, return standard options

      return options;
    } catch (error) {
      throw new Error(`Failed to calculate shipping options: ${error.message}`);
    }
  }

  async applyPromoCode(userId, sessionId, promoCode) {
    try {
      // This would integrate with a promo code system
      // For now, return a simple implementation

      const validCodes = {
        WELCOME10: { type: "percentage", value: 10, minAmount: 50 },
        GRAD2024: { type: "fixed", value: 15, minAmount: 75 },
        FREESHIP: { type: "free_shipping", value: 0, minAmount: 25 },
      };

      const cart = await this.getOrCreateCart(userId, sessionId);
      const summary = cart.getSummary();
      const promo = validCodes[promoCode.toUpperCase()];

      if (!promo) {
        throw new Error("Invalid promo code");
      }

      if (summary.subtotal < promo.minAmount) {
        throw new Error(
          `Minimum order amount of $${promo.minAmount} required for this promo code`
        );
      }

      let discount = 0;
      switch (promo.type) {
        case "percentage":
          discount = (summary.subtotal * promo.value) / 100;
          break;
        case "fixed":
          discount = Math.min(promo.value, summary.subtotal);
          break;
        case "free_shipping":
          discount = summary.shipping;
          break;
      }

      return {
        isValid: true,
        code: promoCode.toUpperCase(),
        discount: parseFloat(discount.toFixed(2)),
        type: promo.type,
        description: this._getPromoDescription(promo),
      };
    } catch (error) {
      throw new Error(`Failed to apply promo code: ${error.message}`);
    }
  }

  // Helper methods
  _getPromoDescription(promo) {
    switch (promo.type) {
      case "percentage":
        return `${promo.value}% off your order`;
      case "fixed":
        return `$${promo.value} off your order`;
      case "free_shipping":
        return "Free shipping on your order";
      default:
        return "Discount applied";
    }
  }
}
