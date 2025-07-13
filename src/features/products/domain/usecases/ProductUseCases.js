import { ProductsRepository } from '../../data/repositories/ProductsRepository.js';

/**
 * Get All Products Use Case
 * Business logic for retrieving all products
 */
export class GetAllProductsUseCase {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  /**
   * Execute the use case
   * @returns {Promise<Product[]>} Array of products
   */
  async execute() {
    try {
      const products = await this.productsRepository.getAllProducts();
      
      // Business logic: Sort by featured first, then popular, then by rating
      return products.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return b.rating - a.rating;
      });
    } catch (error) {
      console.error('GetAllProductsUseCase error:', error);
      throw error;
    }
  }
}

/**
 * Get Product By ID Use Case
 * Business logic for retrieving a specific product
 */
export class GetProductByIdUseCase {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  /**
   * Execute the use case
   * @param {string} productId Product ID
   * @returns {Promise<Product|null>} Product or null if not found
   */
  async execute(productId) {
    try {
      if (!productId || typeof productId !== 'string') {
        throw new Error('Valid product ID is required');
      }

      const product = await this.productsRepository.getProductById(productId);
      
      if (!product) {
        console.warn(`Product with ID ${productId} not found`);
        return null;
      }

      // Business logic: Log view (could be used for analytics)
      console.log(`Product viewed: ${product.name} (${product.id})`);
      
      return product;
    } catch (error) {
      console.error('GetProductByIdUseCase error:', error);
      throw error;
    }
  }
}

/**
 * Search Products Use Case
 * Business logic for searching products
 */
export class SearchProductsUseCase {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  /**
   * Execute the use case
   * @param {Object} searchParams Search parameters
   * @param {string} searchParams.query Search query
   * @param {string} searchParams.category Category filter
   * @param {number} searchParams.minPrice Minimum price
   * @param {number} searchParams.maxPrice Maximum price
   * @param {string} searchParams.sortBy Sort option
   * @returns {Promise<Object>} Search results with metadata
   */
  async execute(searchParams = {}) {
    try {
      const {
        query = '',
        category = 'all',
        minPrice,
        maxPrice,
        sortBy = 'popular'
      } = searchParams;

      // Validate search parameters
      if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
        throw new Error('Minimum price cannot be greater than maximum price');
      }

      const filters = {
        search: query.trim(),
        category: category === 'all' ? undefined : category,
        minPrice,
        maxPrice,
        sortBy
      };

      const products = await this.productsRepository.getProductsWithFilters(filters);

      // Business logic: Return results with metadata
      return {
        products,
        metadata: {
          totalResults: products.length,
          searchQuery: query,
          appliedFilters: {
            category: category !== 'all' ? category : null,
            priceRange: minPrice !== undefined || maxPrice !== undefined ? { minPrice, maxPrice } : null,
            sortBy
          },
          hasResults: products.length > 0
        }
      };
    } catch (error) {
      console.error('SearchProductsUseCase error:', error);
      throw error;
    }
  }
}

/**
 * Get Featured Products Use Case
 * Business logic for retrieving featured products
 */
export class GetFeaturedProductsUseCase {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  /**
   * Execute the use case
   * @param {number} limit Maximum number of products to return
   * @returns {Promise<Product[]>} Array of featured products
   */
  async execute(limit = 6) {
    try {
      const featuredProducts = await this.productsRepository.getFeaturedProducts();
      
      // Business logic: Sort by rating and limit results
      const sortedProducts = featuredProducts
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);

      return sortedProducts;
    } catch (error) {
      console.error('GetFeaturedProductsUseCase error:', error);
      throw error;
    }
  }
}

/**
 * Get Popular Products Use Case
 * Business logic for retrieving popular products
 */
export class GetPopularProductsUseCase {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  /**
   * Execute the use case
   * @param {number} limit Maximum number of products to return
   * @returns {Promise<Product[]>} Array of popular products
   */
  async execute(limit = 8) {
    try {
      const popularProducts = await this.productsRepository.getPopularProducts();
      
      // Business logic: Sort by reviews count and rating
      const sortedProducts = popularProducts
        .sort((a, b) => {
          // First sort by review count, then by rating
          if (b.reviews !== a.reviews) {
            return b.reviews - a.reviews;
          }
          return b.rating - a.rating;
        })
        .slice(0, limit);

      return sortedProducts;
    } catch (error) {
      console.error('GetPopularProductsUseCase error:', error);
      throw error;
    }
  }
}

/**
 * Get Product Categories Use Case
 * Business logic for retrieving product categories
 */
export class GetProductCategoriesUseCase {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  /**
   * Execute the use case
   * @returns {Promise<Object[]>} Array of categories with product counts
   */
  async execute() {
    try {
      const [categories, products] = await Promise.all([
        this.productsRepository.getCategories(),
        this.productsRepository.getAllProducts()
      ]);

      // Business logic: Add product counts to categories
      const categoriesWithCounts = categories.map(category => ({
        ...category,
        productCount: products.filter(product => product.category === category.id).length
      }));

      return categoriesWithCounts;
    } catch (error) {
      console.error('GetProductCategoriesUseCase error:', error);
      throw error;
    }
  }
}
