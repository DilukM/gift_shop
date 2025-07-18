export class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  // Get all products with filtering and pagination
  async getProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        search,
        minPrice,
        maxPrice,
        sortBy = "created_at",
        inStock,
        featured,
        popular,
      } = req.query;

      const filters = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        ...(category && { categoryId: category }),
        ...(minPrice && { minPrice: parseFloat(minPrice) }),
        ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
        ...(inStock === "true" && { inStock: true }),
        ...(featured === "true" && { featured: true }),
        ...(popular === "true" && { popular: true }),
      };

      let result;
      if (search) {
        result = await this.productService.searchProducts({
          query: search,
          filters,
        });
      } else {
        result = await this.productService.getAllProducts(filters);
      }

      res.json({
        success: true,
        data: result,
        message: "Products retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get single product by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        data: product,
        message: "Product retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get single product by slug
  async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;
      const product = await this.productService.getProductBySlug(slug);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        data: product,
        message: "Product retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get featured products
  async getFeaturedProducts(req, res) {
    try {
      const { limit = 6 } = req.query;
      const products = await this.productService.getFeaturedProducts(
        parseInt(limit)
      );

      res.json({
        success: true,
        data: products,
        message: "Featured products retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get popular products
  async getPopularProducts(req, res) {
    try {
      const { limit = 8 } = req.query;
      const products = await this.productService.getPopularProducts(
        parseInt(limit)
      );

      res.json({
        success: true,
        data: products,
        message: "Popular products retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get related products
  async getRelatedProducts(req, res) {
    try {
      const { id } = req.params;
      const { limit = 4 } = req.query;

      const products = await this.productService.getRelatedProducts(
        id,
        parseInt(limit)
      );

      res.json({
        success: true,
        data: products,
        message: "Related products retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get product categories
  async getCategories(req, res) {
    try {
      const categories = await this.productService.getCategories();

      res.json({
        success: true,
        data: categories,
        message: "Categories retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get products by category
  async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const {
        page = 1,
        limit = 12,
        sortBy = "created_at",
        minPrice,
        maxPrice,
        inStock,
      } = req.query;

      const filters = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        ...(minPrice && { minPrice: parseFloat(minPrice) }),
        ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
        ...(inStock === "true" && { inStock: true }),
      };

      const result = await this.productService.getProductsByCategory(
        categoryId,
        filters
      );

      res.json({
        success: true,
        data: result,
        message: "Products retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get homepage data
  async getHomepageData(req, res) {
    try {
      const data = await this.productService.getHomepageData();

      res.json({
        success: true,
        data,
        message: "Homepage data retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Search products
  async searchProducts(req, res) {
    try {
      const {
        q: query,
        page = 1,
        limit = 12,
        category,
        minPrice,
        maxPrice,
        sortBy = "relevance",
        inStock,
      } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const searchParams = {
        query,
        filters: {
          page: parseInt(page),
          limit: parseInt(limit),
          sortBy,
          ...(category && { categoryId: category }),
          ...(minPrice && { minPrice: parseFloat(minPrice) }),
          ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
          ...(inStock === "true" && { inStock: true }),
        },
      };

      const result = await this.productService.searchProducts(searchParams);

      res.json({
        success: true,
        data: result,
        message: "Search completed successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Admin endpoints (would need authentication middleware)
  async createProduct(req, res) {
    try {
      const product = await this.productService.createProduct(req.body);

      res.status(201).json({
        success: true,
        data: product,
        message: "Product created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await this.productService.updateProduct(id, req.body);

      res.json({
        success: true,
        data: product,
        message: "Product updated successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id);

      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProductStatistics(req, res) {
    try {
      const stats = await this.productService.getProductStatistics();

      res.json({
        success: true,
        data: stats,
        message: "Product statistics retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
