import { Product } from "../../domain/entities/Product.js";
import productsData from "../datasources/products.json";

/**
 * Products Data Source
 * Handles data access for products from local JSON file
 */
export class ProductsDataSource {
  constructor() {
    this.products = productsData.products.map(
      (productData) => new Product(productData)
    );
    this.categories = productsData.categories || [];
  }

  /**
   * Get all products
   * @returns {Promise<Product[]>} Array of products
   */
  async getAllProducts() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [...this.products];
  }

  /**
   * Get product by ID
   * @param {string} id Product ID
   * @returns {Promise<Product|null>} Product or null if not found
   */
  async getProductById(id) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return this.products.find((product) => product.id === id) || null;
  }

  /**
   * Get products by category
   * @param {string} category Category name
   * @returns {Promise<Product[]>} Array of products in category
   */
  async getProductsByCategory(category) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.products.filter((product) => product.category === category);
  }

  /**
   * Search products
   * @param {string} searchTerm Search term
   * @returns {Promise<Product[]>} Array of matching products
   */
  async searchProducts(searchTerm) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (!searchTerm) return this.getAllProducts();

    return this.products.filter((product) => product.matchesSearch(searchTerm));
  }

  /**
   * Get featured products
   * @returns {Promise<Product[]>} Array of featured products
   */
  async getFeaturedProducts() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.products.filter((product) => product.isFeatured);
  }

  /**
   * Get popular products
   * @returns {Promise<Product[]>} Array of popular products
   */
  async getPopularProducts() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.products.filter((product) => product.isPopular);
  }

  /**
   * Get products with filters
   * @param {Object} filters Filter options
   * @param {string} filters.category Category filter
   * @param {number} filters.minPrice Minimum price
   * @param {number} filters.maxPrice Maximum price
   * @param {string} filters.sortBy Sort option
   * @param {string} filters.search Search term
   * @returns {Promise<Product[]>} Filtered products
   */
  async getProductsWithFilters(filters = {}) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let filteredProducts = [...this.products];

    // Filter by search term
    if (filters.search) {
      filteredProducts = filteredProducts.filter((product) =>
        product.matchesSearch(filters.search)
      );
    }

    // Filter by category
    if (filters.category && filters.category !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === filters.category
      );
    }

    // Filter by price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const minPrice = filters.minPrice || 0;
      const maxPrice = filters.maxPrice || Infinity;
      filteredProducts = filteredProducts.filter((product) =>
        product.isInPriceRange(minPrice, maxPrice)
      );
    }

    // Sort products
    if (filters.sortBy) {
      filteredProducts = this._sortProducts(filteredProducts, filters.sortBy);
    }

    return filteredProducts;
  }

  /**
   * Get all categories
   * @returns {Promise<Object[]>} Array of categories
   */
  async getCategories() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [...this.categories];
  }

  /**
   * Sort products by specified criteria
   * @private
   * @param {Product[]} products Products to sort
   * @param {string} sortBy Sort criteria
   * @returns {Product[]} Sorted products
   */
  _sortProducts(products, sortBy) {
    const sortedProducts = [...products];

    switch (sortBy) {
      case "price-low-high":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-high-low":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "name":
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "rating":
        return sortedProducts.sort((a, b) => b.rating - a.rating);
      case "popular":
        return sortedProducts.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return b.rating - a.rating;
        });
      default:
        return sortedProducts;
    }
  }
}
