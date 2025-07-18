export class ContactRepository {
  async create(contactMessage) {
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

  async getContactStatistics(period) {
    throw new Error("Method must be implemented");
  }

  async markAsRead(id) {
    throw new Error("Method must be implemented");
  }
}
