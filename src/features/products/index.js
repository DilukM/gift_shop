// Products feature exports
export { ProductsService } from "./application/services/ProductsService.js";
export { Product } from "./domain/entities/Product.js";
export {
  GetAllProductsUseCase,
  GetProductByIdUseCase,
  SearchProductsUseCase,
  GetFeaturedProductsUseCase,
  GetPopularProductsUseCase,
  GetProductCategoriesUseCase,
} from "./domain/usecases/ProductUseCases.js";

// Presentation layer exports
export { default as Store } from "./presentation/pages/Store.jsx";
export { default as ProductDetails } from "./presentation/pages/ProductDetails.jsx";
export { default as Gallery } from "./presentation/pages/Gallery.jsx";
export { default as PopularProducts } from "./presentation/components/PopularProducts.jsx";
export { default as CategorySection } from "./presentation/components/CategorySection.jsx";
