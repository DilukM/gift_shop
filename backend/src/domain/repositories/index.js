export class IProductRepository {
  async findAll(filters = {}) {
    throw new Error("Method not implemented");
  }

  async findById(id) {
    throw new Error("Method not implemented");
  }

  async findBySlug(slug) {
    throw new Error("Method not implemented");
  }

  async findByCategory(categoryId, filters = {}) {
    throw new Error("Method not implemented");
  }

  async search(searchTerm, filters = {}) {
    throw new Error("Method not implemented");
  }

  async findFeatured(limit = 10) {
    throw new Error("Method not implemented");
  }

  async findPopular(limit = 10) {
    throw new Error("Method not implemented");
  }

  async create(productData) {
    throw new Error("Method not implemented");
  }

  async update(id, productData) {
    throw new Error("Method not implemented");
  }

  async delete(id) {
    throw new Error("Method not implemented");
  }

  async updateStock(id, quantity) {
    throw new Error("Method not implemented");
  }

  async updateRating(id, rating, reviewCount) {
    throw new Error("Method not implemented");
  }
}

export class ICartRepository {
  async findByUserId(userId) {
    throw new Error("Method not implemented");
  }

  async findBySessionId(sessionId) {
    throw new Error("Method not implemented");
  }

  async create(cartData) {
    throw new Error("Method not implemented");
  }

  async addItem(cartId, productId, quantity, price) {
    throw new Error("Method not implemented");
  }

  async updateItemQuantity(cartId, productId, quantity) {
    throw new Error("Method not implemented");
  }

  async removeItem(cartId, productId) {
    throw new Error("Method not implemented");
  }

  async clear(cartId) {
    throw new Error("Method not implemented");
  }

  async delete(cartId) {
    throw new Error("Method not implemented");
  }
}

export class IOrderRepository {
  async findAll(filters = {}) {
    throw new Error("Method not implemented");
  }

  async findById(id) {
    throw new Error("Method not implemented");
  }

  async findByOrderNumber(orderNumber) {
    throw new Error("Method not implemented");
  }

  async findByUserId(userId, filters = {}) {
    throw new Error("Method not implemented");
  }

  async create(orderData) {
    throw new Error("Method not implemented");
  }

  async update(id, orderData) {
    throw new Error("Method not implemented");
  }

  async updateStatus(id, status) {
    throw new Error("Method not implemented");
  }

  async updatePaymentStatus(id, paymentStatus) {
    throw new Error("Method not implemented");
  }

  async addTrackingNumber(id, trackingNumber) {
    throw new Error("Method not implemented");
  }
}

export class ICategoryRepository {
  async findAll() {
    throw new Error("Method not implemented");
  }

  async findById(id) {
    throw new Error("Method not implemented");
  }

  async findBySlug(slug) {
    throw new Error("Method not implemented");
  }

  async create(categoryData) {
    throw new Error("Method not implemented");
  }

  async update(id, categoryData) {
    throw new Error("Method not implemented");
  }

  async delete(id) {
    throw new Error("Method not implemented");
  }
}

export class IContactRepository {
  async findAll(filters = {}) {
    throw new Error("Method not implemented");
  }

  async findById(id) {
    throw new Error("Method not implemented");
  }

  async create(messageData) {
    throw new Error("Method not implemented");
  }

  async update(id, messageData) {
    throw new Error("Method not implemented");
  }

  async updateStatus(id, status) {
    throw new Error("Method not implemented");
  }

  async respond(id, responseMessage) {
    throw new Error("Method not implemented");
  }
}
