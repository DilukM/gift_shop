import express from "express";
import { CartController } from "../controllers/CartController.js";
import {
  validateCartItem,
  validateProductId,
} from "../middleware/validation.js";

const router = express.Router();

export const createCartRoutes = (cartService) => {
  const cartController = new CartController(cartService);

  // Get cart
  router.get("/", (req, res) => cartController.getCart(req, res));

  // Get cart summary
  router.get("/summary", (req, res) => cartController.getCartSummary(req, res));

  // Validate cart
  router.get("/validate", (req, res) => cartController.validateCart(req, res));

  // Add item to cart
  router.post("/items", validateCartItem, (req, res) =>
    cartController.addItem(req, res)
  );

  // Update item quantity
  router.put("/items/:productId", validateProductId, (req, res) =>
    cartController.updateItemQuantity(req, res)
  );

  // Remove item from cart
  router.delete("/items/:productId", validateProductId, (req, res) =>
    cartController.removeItem(req, res)
  );

  // Check if product is in cart
  router.get("/items/:productId", validateProductId, (req, res) =>
    cartController.checkProductInCart(req, res)
  );

  // Clear cart
  router.delete("/", (req, res) => cartController.clearCart(req, res));

  // Get shipping options
  router.post("/shipping", (req, res) =>
    cartController.getShippingOptions(req, res)
  );

  // Apply promo code
  router.post("/promo", (req, res) => cartController.applyPromoCode(req, res));

  // Merge guest cart (requires authentication)
  // router.post('/merge', authMiddleware, (req, res) => cartController.mergeGuestCart(req, res));

  return router;
};

export default createCartRoutes;
