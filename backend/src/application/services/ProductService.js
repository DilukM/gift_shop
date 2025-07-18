import {
  GetAllProductsUseCase,
  GetProductByIdUseCase,
  SearchProductsUseCase,
  GetFeaturedProductsUseCase,
  GetPopularProductsUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from "../../domain/usecases/ProductUseCases.js";

export class ProductService {
  constructor(productRepository, categoryRepository) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;

    // Initialize use cases
    this.getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
    this.getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
    this.searchProductsUseCase = new SearchProductsUseCase(productRepository);
    this.getFeaturedProductsUseCase = new GetFeaturedProductsUseCase(
      productRepository
    );
    this.getPopularProductsUseCase = new GetPopularProductsUseCase(
      productRepository
    );
    this.createProductUseCase = new CreateProductUseCase(productRepository);
    this.updateProductUseCase = new UpdateProductUseCase(productRepository);
    this.deleteProductUseCase = new DeleteProductUseCase(productRepository);
  }

  async getAllProducts(filters = {}) {
    try {
      return await this.getAllProductsUseCase.execute(filters);
    } catch (error) {
      throw new Error(`Failed to get products: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      return await this.getProductByIdUseCase.execute(id);
    } catch (error) {
      throw new Error(`Failed to get product: ${error.message}`);
    }
  }

  async getProductBySlug(slug) {
    try {
      return await this.productRepository.findBySlug(slug);
    } catch (error) {
      throw new Error(`Failed to get product: ${error.message}`);
    }
  }

  async searchProducts(searchParams) {
    try {
      return await this.searchProductsUseCase.execute(searchParams);
    } catch (error) {
      throw new Error(`Failed to search products: ${error.message}`);
    }
  }

  async getFeaturedProducts(limit = 6) {
    try {
      return await this.getFeaturedProductsUseCase.execute(limit);
    } catch (error) {
      throw new Error(`Failed to get featured products: ${error.message}`);
    }
  }

  async getPopularProducts(limit = 8) {
    try {
      return await this.getPopularProductsUseCase.execute(limit);
    } catch (error) {
      throw new Error(`Failed to get popular products: ${error.message}`);
    }
  }

  async getProductsByCategory(categoryId, filters = {}) {
    try {
      return await this.productRepository.findByCategory(categoryId, filters);
    } catch (error) {
      throw new Error(`Failed to get products by category: ${error.message}`);
    }
  }

  async getRelatedProducts(productId, limit = 4) {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        return [];
      }

      // Get products from same category
      const relatedProducts = await this.productRepository.findByCategory(
        product.categoryId,
        { limit: limit * 2, isActive: true }
      );

      // Filter out current product and limit results
      const filtered = relatedProducts.products
        .filter((p) => p.id !== productId)
        .slice(0, limit);

      // If not enough products in same category, fill with popular products
      if (filtered.length < limit) {
        const popularProducts = await this.getPopularProducts(limit * 2);
        const additional = popularProducts
          .filter(
            (p) => p.id !== productId && !filtered.find((fp) => fp.id === p.id)
          )
          .slice(0, limit - filtered.length);

        filtered.push(...additional);
      }

      return filtered;
    } catch (error) {
      throw new Error(`Failed to get related products: ${error.message}`);
    }
  }

  async getCategories() {
    try {
      const categories = await this.categoryRepository.findAll();

      // Add product counts for each category
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const result = await this.productRepository.findByCategory(
            category.id,
            {
              limit: 1,
              isActive: true,
            }
          );

          return {
            ...category.toJSON(),
            productCount: result.pagination?.total || 0,
          };
        })
      );

      return categoriesWithCounts;
    } catch (error) {
      throw new Error(`Failed to get categories: ${error.message}`);
    }
  }

  async getHomepageData() {
    try {
      const [featuredProducts, popularProducts, categories] = await Promise.all(
        [
          this.getFeaturedProducts(6),
          this.getPopularProducts(8),
          this.getCategories(),
        ]
      );

      return {
        featured: featuredProducts,
        popular: popularProducts,
        categories: categories.slice(0, 6), // Limit categories for homepage
        hero: featuredProducts[0] || null,
        stats: {
          totalProducts: popularProducts.length + featuredProducts.length,
          totalCategories: categories.length,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get homepage data: ${error.message}`);
    }
  }

  async createProduct(productData) {
    try {
      // Generate slug from name if not provided
      if (!productData.slug && productData.name) {
        productData.slug = this._generateSlug(productData.name);
      }

      return await this.createProductUseCase.execute(productData);
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async updateProduct(id, productData) {
    try {
      return await this.updateProductUseCase.execute(id, productData);
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      return await this.deleteProductUseCase.execute(id);
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  async updateProductStock(id, quantityChange) {
    try {
      return await this.productRepository.updateStock(id, quantityChange);
    } catch (error) {
      throw new Error(`Failed to update product stock: ${error.message}`);
    }
  }

  async getProductStatistics() {
    try {
      const [allProducts, categories] = await Promise.all([
        this.productRepository.findAll({ limit: 1000 }), // Get all for stats
        this.categoryRepository.findAll(),
      ]);

      const products = allProducts.products;

      return {
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.isActive).length,
        featuredProducts: products.filter((p) => p.isFeatured).length,
        popularProducts: products.filter((p) => p.isPopular).length,
        outOfStockProducts: products.filter((p) => p.stockCount === 0).length,
        averagePrice:
          products.reduce((sum, p) => sum + p.price, 0) / products.length,
        averageRating:
          products.reduce((sum, p) => sum + p.rating, 0) / products.length,
        totalCategories: categories.length,
        categoryBreakdown: categories.map((cat) => ({
          category: cat.name,
          count: products.filter((p) => p.categoryId === cat.id).length,
        })),
      };
    } catch (error) {
      throw new Error(`Failed to get product statistics: ${error.message}`);
    }
  }

  // Helper methods
  _generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }
}
