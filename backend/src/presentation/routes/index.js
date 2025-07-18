import express from "express";
import productRoutes from "./productRoutes.js";
import cartRoutes from "./cartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import contactRoutes from "./contactRoutes.js";

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "GiftBloom Backend API",
  });
});

// API documentation endpoint
router.get("/", (req, res) => {
  res.json({
    service: "GiftBloom Backend API",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      products: {
        base: "/api/products",
        endpoints: {
          "GET /": "Get all products with filtering",
          "GET /:id": "Get product by ID or slug",
          "POST /": "Create new product (admin)",
          "PUT /:id": "Update product (admin)",
          "DELETE /:id": "Delete product (admin)",
        },
      },
      cart: {
        base: "/api/cart",
        endpoints: {
          "GET /:id": "Get cart by ID",
          "POST /": "Create new cart",
          "POST /:id/items": "Add item to cart",
          "PUT /:id/items/:itemId": "Update cart item",
          "DELETE /:id/items/:itemId": "Remove item from cart",
          "DELETE /:id": "Clear cart",
        },
      },
      orders: {
        base: "/api/orders",
        endpoints: {
          "GET /": "Get all orders",
          "GET /:id": "Get order by ID",
          "POST /": "Create new order",
          "PATCH /:id/status": "Update order status",
          "PATCH /:id/cancel": "Cancel order",
          "GET /:id/tracking": "Get order tracking info",
        },
      },
      contact: {
        base: "/api/contact",
        endpoints: {
          "POST /": "Submit contact message",
          "GET /": "Get all contact messages (admin)",
          "GET /:id": "Get contact message by ID",
          "PATCH /:id/status": "Update message status",
          "PATCH /:id/reply": "Reply to message",
        },
      },
    },
  });
});

// API routes
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/contact", contactRoutes);

export default router;
