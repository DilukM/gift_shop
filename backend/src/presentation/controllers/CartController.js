export class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  // Helper to get user/session ID from request
  _getCartIdentifiers(req) {
    const userId = req.user?.id || null;
    const sessionId = req.sessionID || req.headers["x-session-id"] || req.ip;
    return { userId, sessionId };
  }

  // Get cart
  async getCart(req, res) {
    try {
      const { userId, sessionId } = this._getCartIdentifiers(req);
      const cart = await this.cartService.getCart(userId, sessionId);

      res.json({
        success: true,
        data: cart
          ? cart.toJSON()
          : {
              items: [],
              summary: {
                itemCount: 0,
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,
              },
            },
        message: "Cart retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Add item to cart
  async addItem(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;
      const { userId, sessionId } = this._getCartIdentifiers(req);

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1",
        });
      }

      const cart = await this.cartService.addItemToCart(
        userId,
        sessionId,
        productId,
        parseInt(quantity)
      );

      res.json({
        success: true,
        data: cart.toJSON(),
        message: "Item added to cart successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update item quantity
  async updateItemQuantity(req, res) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const { userId, sessionId } = this._getCartIdentifiers(req);

      if (quantity === undefined || quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Valid quantity is required",
        });
      }

      const cart = await this.cartService.updateItemQuantity(
        userId,
        sessionId,
        productId,
        parseInt(quantity)
      );

      res.json({
        success: true,
        data: cart.toJSON(),
        message: "Item quantity updated successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Remove item from cart
  async removeItem(req, res) {
    try {
      const { productId } = req.params;
      const { userId, sessionId } = this._getCartIdentifiers(req);

      const cart = await this.cartService.removeItemFromCart(
        userId,
        sessionId,
        productId
      );

      res.json({
        success: true,
        data: cart.toJSON(),
        message: "Item removed from cart successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Clear cart
  async clearCart(req, res) {
    try {
      const { userId, sessionId } = this._getCartIdentifiers(req);
      const cart = await this.cartService.clearCart(userId, sessionId);

      res.json({
        success: true,
        data: cart.toJSON(),
        message: "Cart cleared successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get cart summary
  async getCartSummary(req, res) {
    try {
      const { userId, sessionId } = this._getCartIdentifiers(req);
      const summary = await this.cartService.getCartSummary(userId, sessionId);

      res.json({
        success: true,
        data: summary,
        message: "Cart summary retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Validate cart
  async validateCart(req, res) {
    try {
      const { userId, sessionId } = this._getCartIdentifiers(req);
      const validation = await this.cartService.validateCart(userId, sessionId);

      res.json({
        success: true,
        data: validation,
        message: "Cart validation completed",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Check if product is in cart
  async checkProductInCart(req, res) {
    try {
      const { productId } = req.params;
      const { userId, sessionId } = this._getCartIdentifiers(req);

      const isInCart = await this.cartService.isProductInCart(
        userId,
        sessionId,
        productId
      );
      const quantity = await this.cartService.getItemQuantity(
        userId,
        sessionId,
        productId
      );

      res.json({
        success: true,
        data: {
          inCart: isInCart,
          quantity,
        },
        message: "Product cart status retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get shipping options
  async getShippingOptions(req, res) {
    try {
      const { userId, sessionId } = this._getCartIdentifiers(req);
      const { address } = req.body;

      const options = await this.cartService.calculateShippingOptions(
        userId,
        sessionId,
        address
      );

      res.json({
        success: true,
        data: options,
        message: "Shipping options retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Apply promo code
  async applyPromoCode(req, res) {
    try {
      const { promoCode } = req.body;
      const { userId, sessionId } = this._getCartIdentifiers(req);

      if (!promoCode) {
        return res.status(400).json({
          success: false,
          message: "Promo code is required",
        });
      }

      const result = await this.cartService.applyPromoCode(
        userId,
        sessionId,
        promoCode
      );

      res.json({
        success: true,
        data: result,
        message: "Promo code applied successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Merge guest cart with user cart (for when user logs in)
  async mergeGuestCart(req, res) {
    try {
      const { guestSessionId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      if (!guestSessionId) {
        return res.status(400).json({
          success: false,
          message: "Guest session ID is required",
        });
      }

      const mergedCart = await this.cartService.mergeGuestCartWithUserCart(
        guestSessionId,
        userId
      );

      res.json({
        success: true,
        data: mergedCart ? mergedCart.toJSON() : null,
        message: "Carts merged successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
