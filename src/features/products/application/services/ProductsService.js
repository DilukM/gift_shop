import {
  GetAllProductsUseCase,
  GetProductByIdUseCase,
  SearchProductsUseCase,
  GetFeaturedProductsUseCase,
  GetPopularProductsUseCase,
  GetProductCategoriesUseCase,
} from "../../domain/usecases/ProductUseCases.js";

/**
 * Products Service
 * Application layer service coordinating product-related operations
 */
export class ProductsService {
  constructor() {
    this.getAllProductsUseCase = new GetAllProductsUseCase();
    this.getProductByIdUseCase = new GetProductByIdUseCase();
    this.searchProductsUseCase = new SearchProductsUseCase();
    this.getFeaturedProductsUseCase = new GetFeaturedProductsUseCase();
    this.getPopularProductsUseCase = new GetPopularProductsUseCase();
    this.getProductCategoriesUseCase = new GetProductCategoriesUseCase();
  }

  /**
   * Get all products
   * @returns {Promise<Product[]>} Array of products
   */
  async getAllProducts() {
    return await this.getAllProductsUseCase.execute();
  }

  /**
   * Get product by ID
   * @param {string} productId Product ID
   * @returns {Promise<Product|null>} Product or null if not found
   */
  async getProductById(productId) {
    return await this.getProductByIdUseCase.execute(productId);
  }

  /**
   * Search and filter products
   * @param {Object} searchParams Search parameters
   * @returns {Promise<Object>} Search results with metadata
   */
  async searchProducts(searchParams) {
    return await this.searchProductsUseCase.execute(searchParams);
  }

  /**
   * Get featured products for homepage
   * @param {number} limit Maximum number of products
   * @returns {Promise<Product[]>} Featured products
   */
  async getFeaturedProducts(limit = 6) {
    return await this.getFeaturedProductsUseCase.execute(limit);
  }

  /**
   * Get popular products
   * @param {number} limit Maximum number of products
   * @returns {Promise<Product[]>} Popular products
   */
  async getPopularProducts(limit = 8) {
    return await this.getPopularProductsUseCase.execute(limit);
  }

  /**
   * Get product categories with counts
   * @returns {Promise<Object[]>} Categories with product counts
   */
  async getCategories() {
    return await this.getProductCategoriesUseCase.execute();
  }

  /**
   * Get products for store page with pagination
   * @param {Object} params Parameters
   * @param {number} params.page Page number (1-based)
   * @param {number} params.limit Items per page
   * @param {Object} params.filters Search filters
   * @returns {Promise<Object>} Paginated products
   */
  async getProductsForStore({ page = 1, limit = 12, filters = {} }) {
    try {
      const searchResult = await this.searchProducts(filters);
      const { products } = searchResult;

      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = products.slice(startIndex, endIndex);

      const totalPages = Math.ceil(products.length / limit);

      return {
        products: paginatedProducts,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: products.length,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          startIndex: startIndex + 1,
          endIndex: Math.min(endIndex, products.length),
        },
        metadata: searchResult.metadata,
      };
    } catch (error) {
      console.error("ProductsService.getProductsForStore error:", error);
      throw error;
    }
  }

  /**
   * Get related products based on category
   * @param {string} productId Current product ID
   * @param {number} limit Maximum number of products
   * @returns {Promise<Product[]>} Related products
   */
  async getRelatedProducts(productId, limit = 4) {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        return [];
      }

      const allProducts = await this.getAllProducts();

      // Get products from same category, excluding current product
      const relatedProducts = allProducts
        .filter((p) => p.id !== productId && p.category === product.category)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);

      // If not enough products in same category, fill with popular products
      if (relatedProducts.length < limit) {
        const popularProducts = await this.getPopularProducts(limit * 2);
        const additionalProducts = popularProducts
          .filter(
            (p) =>
              p.id !== productId &&
              !relatedProducts.find((rp) => rp.id === p.id)
          )
          .slice(0, limit - relatedProducts.length);

        relatedProducts.push(...additionalProducts);
      }

      return relatedProducts.slice(0, limit);
    } catch (error) {
      console.error("ProductsService.getRelatedProducts error:", error);
      throw error;
    }
  }

  /**
   * Get product recommendations for homepage
   * @returns {Promise<Object>} Organized product recommendations
   */
  async getHomepageRecommendations() {
    try {
      const [featured, popular, categories] = await Promise.all([
        this.getFeaturedProducts(6),
        this.getPopularProducts(8),
        this.getCategories(),
      ]);

      return {
        featured,
        popular,
        categories,
        sections: {
          hero: featured.slice(0, 1)[0] || null,
          featuredGrid: featured.slice(1, 4),
          popularSection: popular.slice(0, 6),
          categoryShowcase: categories.slice(0, 3),
        },
      };
    } catch (error) {
      console.error("ProductsService.getHomepageRecommendations error:", error);
      throw error;
    }
  }
}
