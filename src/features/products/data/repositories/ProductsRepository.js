import { ProductsDataSource } from "../datasources/ProductsDataSource.js";

/**
 * Products Repository
 * Interface between domain and data layers for products
 */
export class ProductsRepository {
  constructor() {
    this.dataSource = new ProductsDataSource();
  }

  /**
   * Get all products
   * @returns {Promise<Product[]>} Array of products
   */
  async getAllProducts() {
    try {
      return await this.dataSource.getAllProducts();
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  /**
   * Get product by ID
   * @param {string} id Product ID
   * @returns {Promise<Product|null>} Product or null if not found
   */
  async getProductById(id) {
    try {
      if (!id) {
        throw new Error("Product ID is required");
      }
      return await this.dataSource.getProductById(id);
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw new Error("Failed to fetch product");
    }
  }

  /**
   * Get products by category
   * @param {string} category Category name
   * @returns {Promise<Product[]>} Array of products in category
   */
  async getProductsByCategory(category) {
    try {
      if (!category) {
        throw new Error("Category is required");
      }
      return await this.dataSource.getProductsByCategory(category);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw new Error("Failed to fetch products by category");
    }
  }

  /**
   * Search products
   * @param {string} searchTerm Search term
   * @returns {Promise<Product[]>} Array of matching products
   */
  async searchProducts(searchTerm) {
    try {
      return await this.dataSource.searchProducts(searchTerm);
    } catch (error) {
      console.error("Error searching products:", error);
      throw new Error("Failed to search products");
    }
  }

  /**
   * Get featured products
   * @returns {Promise<Product[]>} Array of featured products
   */
  async getFeaturedProducts() {
    try {
      return await this.dataSource.getFeaturedProducts();
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw new Error("Failed to fetch featured products");
    }
  }

  /**
   * Get popular products
   * @returns {Promise<Product[]>} Array of popular products
   */
  async getPopularProducts() {
    try {
      return await this.dataSource.getPopularProducts();
    } catch (error) {
      console.error("Error fetching popular products:", error);
      throw new Error("Failed to fetch popular products");
    }
  }

  /**
   * Get products with filters
   * @param {Object} filters Filter options
   * @returns {Promise<Product[]>} Filtered products
   */
  async getProductsWithFilters(filters = {}) {
    try {
      return await this.dataSource.getProductsWithFilters(filters);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      throw new Error("Failed to fetch filtered products");
    }
  }

  /**
   * Get all categories
   * @returns {Promise<Object[]>} Array of categories
   */
  async getCategories() {
    try {
      return await this.dataSource.getCategories();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }

  /**
   * Get product statistics
   * @returns {Promise<Object>} Product statistics
   */
  async getProductStatistics() {
    try {
      const products = await this.getAllProducts();
      const categories = await this.getCategories();

      return {
        totalProducts: products.length,
        totalCategories: categories.length,
        featuredCount: products.filter((p) => p.isFeatured).length,
        popularCount: products.filter((p) => p.isPopular).length,
        averagePrice:
          products.reduce((sum, p) => sum + p.price, 0) / products.length,
        priceRange: {
          min: Math.min(...products.map((p) => p.price)),
          max: Math.max(...products.map((p) => p.price)),
        },
        categoryBreakdown: categories.map((category) => ({
          ...category,
          productCount: products.filter((p) => p.category === category.id)
            .length,
        })),
      };
    } catch (error) {
      console.error("Error fetching product statistics:", error);
      throw new Error("Failed to fetch product statistics");
    }
  }
}
