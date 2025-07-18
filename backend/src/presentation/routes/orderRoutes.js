import express from "express";
import { OrderController } from "../controllers/OrderController.js";
import { validateRequest } from "../middleware/validation.js";

const router = express.Router();
const orderController = new OrderController();

// Public routes
router.post("/", validateRequest("createOrder"), orderController.createOrder);
router.post(
  "/calculate-totals",
  validateRequest("calculateOrderTotals"),
  orderController.calculateOrderTotals
);
router.get(
  "/:id/tracking",
  validateRequest("orderId"),
  orderController.getOrderTracking
);

// Protected routes (would require authentication middleware)
router.get("/", validateRequest("getOrders"), orderController.getOrders);
router.get("/:id", validateRequest("orderId"), orderController.getOrderById);
router.patch(
  "/:id/status",
  validateRequest("updateOrderStatus"),
  orderController.updateOrderStatus
);
router.patch(
  "/:id/cancel",
  validateRequest("cancelOrder"),
  orderController.cancelOrder
);
router.post(
  "/:id/payment",
  validateRequest("processPayment"),
  orderController.processPayment
);

export default router;
