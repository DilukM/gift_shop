import { OrderService } from "../../application/services/OrderService.js";

export class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  // Get all orders (admin) or user's orders
  getOrders = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, status, userId } = req.query;
      const { orders, pagination } = await this.orderService.getOrders({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        userId,
      });

      res.json({
        success: true,
        data: orders,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get order by ID
  getOrderById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create new order
  createOrder = async (req, res, next) => {
    try {
      const orderData = req.body;
      const order = await this.orderService.createOrder(orderData);

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update order status
  updateOrderStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const order = await this.orderService.updateOrderStatus(
        id,
        status,
        notes
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        message: "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  // Cancel order
  cancelOrder = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const order = await this.orderService.cancelOrder(id, reason);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        message: "Order cancelled successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get order tracking info
  getOrderTracking = async (req, res, next) => {
    try {
      const { id } = req.params;
      const tracking = await this.orderService.getOrderTracking(id);

      if (!tracking) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        data: tracking,
      });
    } catch (error) {
      next(error);
    }
  };

  // Process payment
  processPayment = async (req, res, next) => {
    try {
      const { id } = req.params;
      const paymentData = req.body;

      const result = await this.orderService.processPayment(id, paymentData);

      res.json({
        success: true,
        message: "Payment processed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // Calculate order totals
  calculateOrderTotals = async (req, res, next) => {
    try {
      const { items, shippingAddress, promoCode } = req.body;

      const totals = await this.orderService.calculateOrderTotals({
        items,
        shippingAddress,
        promoCode,
      });

      res.json({
        success: true,
        data: totals,
      });
    } catch (error) {
      next(error);
    }
  };
}
