export class OrderUseCases {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async createOrder(orderData) {
    try {
      return await this.orderRepository.create(orderData);
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async getOrderById(id) {
    try {
      return await this.orderRepository.findById(id);
    } catch (error) {
      throw new Error(`Failed to get order: ${error.message}`);
    }
  }

  async getAllOrders() {
    try {
      return await this.orderRepository.findAll();
    } catch (error) {
      throw new Error(`Failed to get all orders: ${error.message}`);
    }
  }
}
