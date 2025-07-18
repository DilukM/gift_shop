export class GetAllProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(filters = {}) {
    return await this.productRepository.findAll(filters);
  }
}

export class GetProductByIdUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id) {
    if (!id) {
      throw new Error("Product ID is required");
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }
}

export class SearchProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(searchParams = {}) {
    const {
      query,
      filters = {},
      page = 1,
      limit = 12,
      sortBy = "featured",
    } = searchParams;

    const searchFilters = {
      ...filters,
      page,
      limit,
      sortBy,
    };

    if (query) {
      return await this.productRepository.search(query, searchFilters);
    }

    return await this.productRepository.findAll(searchFilters);
  }
}

export class GetFeaturedProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(limit = 6) {
    return await this.productRepository.findFeatured(limit);
  }
}

export class GetPopularProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(limit = 8) {
    return await this.productRepository.findPopular(limit);
  }
}

export class CreateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(productData) {
    // Validate required fields
    const requiredFields = ["name", "price", "categoryId"];
    for (const field of requiredFields) {
      if (!productData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // Validate price
    if (productData.price <= 0) {
      throw new Error("Price must be greater than 0");
    }

    return await this.productRepository.create(productData);
  }
}

export class UpdateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id, productData) {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Validate price if provided
    if (productData.price !== undefined && productData.price <= 0) {
      throw new Error("Price must be greater than 0");
    }

    return await this.productRepository.update(id, productData);
  }
}

export class DeleteProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    return await this.productRepository.delete(id);
  }
}
