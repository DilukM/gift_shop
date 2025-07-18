export class OrderRepository {
  async create(order) {
    throw new Error("Method must be implemented");
  }

  async findById(id) {
    throw new Error("Method must be implemented");
  }

  async findAll(filters = {}) {
    throw new Error("Method must be implemented");
  }

  async update(id, updateData) {
    throw new Error("Method must be implemented");
  }

  async delete(id) {
    throw new Error("Method must be implemented");
  }

  async getOrderStatistics(period) {
    throw new Error("Method must be implemented");
  }

  async findByOrderNumber(orderNumber) {
    throw new Error("Method must be implemented");
  }

  async findByCustomerEmail(email) {
    throw new Error("Method must be implemented");
  }
}
