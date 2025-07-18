import express from "express";
import { ProductController } from "../controllers/ProductController.js";
import {
  validateProductQuery,
  validateProductId,
} from "../middleware/validation.js";

const router = express.Router();

export const createProductRoutes = (productService) => {
  const productController = new ProductController(productService);

  // Public routes
  router.get("/", validateProductQuery, (req, res) =>
    productController.getProducts(req, res)
  );
  router.get("/featured", (req, res) =>
    productController.getFeaturedProducts(req, res)
  );
  router.get("/popular", (req, res) =>
    productController.getPopularProducts(req, res)
  );
  router.get("/categories", (req, res) =>
    productController.getCategories(req, res)
  );
  router.get("/homepage", (req, res) =>
    productController.getHomepageData(req, res)
  );
  router.get("/search", (req, res) =>
    productController.searchProducts(req, res)
  );
  router.get("/stats", (req, res) =>
    productController.getProductStatistics(req, res)
  );

  // Product by category
  router.get("/category/:categoryId", validateProductId, (req, res) =>
    productController.getProductsByCategory(req, res)
  );

  // Product by ID or slug
  router.get("/:id", validateProductId, (req, res) => {
    // Check if it's a UUID or slug
    const { id } = req.params;
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id
      );

    if (isUUID) {
      productController.getProductById(req, res);
    } else {
      productController.getProductBySlug(req, res);
    }
  });

  // Related products
  router.get("/:id/related", validateProductId, (req, res) =>
    productController.getRelatedProducts(req, res)
  );

  // Admin routes (would need authentication middleware)
  // router.post('/', authMiddleware, adminMiddleware, validateProductData, (req, res) => productController.createProduct(req, res));
  // router.put('/:id', authMiddleware, adminMiddleware, validateProductId, validateProductData, (req, res) => productController.updateProduct(req, res));
  // router.delete('/:id', authMiddleware, adminMiddleware, validateProductId, (req, res) => productController.deleteProduct(req, res));

  return router;
};

export default createProductRoutes;
