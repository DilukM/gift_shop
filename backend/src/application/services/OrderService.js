import { OrderUseCases } from "../../domain/usecases/OrderUseCases.js";
import { PostgresOrderRepository } from "../../infrastructure/repositories/PostgresOrderRepository.js";
import { PostgresProductRepository } from "../../infrastructure/repositories/PostgresProductRepository.js";

export class OrderService {
  constructor() {
    this.orderRepository = new PostgresOrderRepository();
    this.productRepository = new PostgresProductRepository();
    this.orderUseCases = new OrderUseCases(
      this.orderRepository,
      this.productRepository
    );
  }

  async createOrder(orderData) {
    return await this.orderUseCases.createOrder(orderData);
  }

  async getOrderById(id) {
    return await this.orderUseCases.getOrderById(id);
  }

  async getOrders({
    page = 1,
    limit = 10,
    status,
    userId,
    startDate,
    endDate,
  } = {}) {
    const orders = await this.orderRepository.findAll({
      page,
      limit,
      status,
      userId,
      startDate,
      endDate,
    });

    // Calculate pagination info
    const totalQuery = await this.orderRepository.findAll({
      status,
      userId,
      startDate,
      endDate,
    });
    const total = totalQuery.length;
    const totalPages = Math.ceil(total / limit);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async updateOrderStatus(id, status, notes) {
    return await this.orderUseCases.updateOrderStatus(id, status, notes);
  }

  async cancelOrder(id, reason) {
    return await this.orderUseCases.cancelOrder(id, reason);
  }

  async processPayment(orderId, paymentData) {
    return await this.orderUseCases.processPayment(orderId, paymentData);
  }

  async getOrderTracking(id) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      return null;
    }

    return {
      orderId: order.id,
      status: order.orderStatus,
      trackingNumber: order.trackingNumber,
      orderDate: order.createdAt,
      estimatedDelivery: this._calculateEstimatedDelivery(order),
      statusHistory: await this._getOrderStatusHistory(id),
    };
  }

  async calculateOrderTotals({ items, shippingAddress, promoCode }) {
    return await this.orderUseCases.calculateOrderTotals({
      items,
      shippingAddress,
      promoCode,
    });
  }

  async getOrderStatistics(period = "30d") {
    return await this.orderRepository.getOrderStatistics(period);
  }

  async validateOrderItems(items) {
    const validatedItems = [];

    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (!product.isInStock(item.quantity)) {
        throw new Error(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }

      validatedItems.push({
        ...item,
        unitPrice: product.price,
        totalPrice: product.price * item.quantity,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          imageUrl: product.imageUrl,
        },
      });
    }

    return validatedItems;
  }

  _calculateEstimatedDelivery(order) {
    const baseDeliveryDays = 3;
    const orderDate = new Date(order.createdAt);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(estimatedDate.getDate() + baseDeliveryDays);

    return estimatedDate;
  }

  async _getOrderStatusHistory(orderId) {
    // This would typically come from an order_status_history table
    // For now, return basic status based on current order
    const order = await this.orderRepository.findById(orderId);

    const statusHistory = [
      {
        status: "pending",
        timestamp: order.createdAt,
        description: "Order placed and awaiting confirmation",
      },
    ];

    if (order.orderStatus !== "pending") {
      statusHistory.push({
        status: order.orderStatus,
        timestamp: order.updatedAt,
        description: this._getStatusDescription(order.orderStatus),
      });
    }

    return statusHistory;
  }

  _getStatusDescription(status) {
    const descriptions = {
      confirmed: "Order confirmed and being prepared",
      processing: "Order is being processed",
      shipped: "Order has been shipped",
      delivered: "Order has been delivered",
      cancelled: "Order has been cancelled",
    };

    return descriptions[status] || "Status updated";
  }
}
