export class GetCartUseCase {
  constructor(cartRepository, productRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  async execute(userId, sessionId) {
    let cart;

    if (userId) {
      cart = await this.cartRepository.findByUserId(userId);
    } else if (sessionId) {
      cart = await this.cartRepository.findBySessionId(sessionId);
    }

    if (!cart) {
      // Create new cart
      cart = await this.cartRepository.create({ userId, sessionId });
    }

    return cart;
  }
}

export class AddItemToCartUseCase {
  constructor(cartRepository, productRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  async execute(cartId, productId, quantity = 1) {
    // Validate product exists and is available
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.isActive) {
      throw new Error("Product is not available");
    }

    if (!product.canPurchase(quantity)) {
      throw new Error(`Insufficient stock. Available: ${product.stockCount}`);
    }

    return await this.cartRepository.addItem(
      cartId,
      productId,
      quantity,
      product.price
    );
  }
}

export class UpdateCartItemQuantityUseCase {
  constructor(cartRepository, productRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  async execute(cartId, productId, quantity) {
    if (quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }

    if (quantity === 0) {
      return await this.cartRepository.removeItem(cartId, productId);
    }

    // Validate stock availability
    const product = await this.productRepository.findById(productId);
    if (product && !product.canPurchase(quantity)) {
      throw new Error(`Insufficient stock. Available: ${product.stockCount}`);
    }

    return await this.cartRepository.updateItemQuantity(
      cartId,
      productId,
      quantity
    );
  }
}

export class RemoveItemFromCartUseCase {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  async execute(cartId, productId) {
    return await this.cartRepository.removeItem(cartId, productId);
  }
}

export class ClearCartUseCase {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  async execute(cartId) {
    return await this.cartRepository.clear(cartId);
  }
}

export class ValidateCartUseCase {
  constructor(cartRepository, productRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  async execute(cartId) {
    const cart =
      (await this.cartRepository.findByUserId(cartId)) ||
      (await this.cartRepository.findBySessionId(cartId));

    if (!cart || cart.isEmpty()) {
      return {
        isValid: false,
        errors: ["Cart is empty"],
      };
    }

    const validation = cart.validate();

    // Additional validations can be added here
    // like checking for price changes, availability, etc.

    return validation;
  }
}
