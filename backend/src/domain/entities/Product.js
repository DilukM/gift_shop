export class Product {
  constructor({
    id,
    name,
    slug,
    description,
    categoryId,
    category,
    price,
    originalPrice,
    sku,
    stockCount = 0,
    isActive = true,
    isFeatured = false,
    isPopular = false,
    weight,
    dimensions,
    images = [],
    features = [],
    tags = [],
    rating = 0,
    reviewCount = 0,
    metaTitle,
    metaDescription,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.categoryId = categoryId;
    this.category = category;
    this.price = parseFloat(price);
    this.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    this.sku = sku;
    this.stockCount = parseInt(stockCount);
    this.isActive = isActive;
    this.isFeatured = isFeatured;
    this.isPopular = isPopular;
    this.weight = weight ? parseFloat(weight) : null;
    this.dimensions = dimensions;
    this.images = Array.isArray(images) ? images : [];
    this.features = Array.isArray(features) ? features : [];
    this.tags = Array.isArray(tags) ? tags : [];
    this.rating = rating ? parseFloat(rating) : 0;
    this.reviewCount = parseInt(reviewCount || 0);
    this.metaTitle = metaTitle;
    this.metaDescription = metaDescription;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business methods
  isInStock() {
    return this.stockCount > 0 && this.isActive;
  }

  hasDiscount() {
    return this.originalPrice && this.originalPrice > this.price;
  }

  getDiscountPercentage() {
    if (!this.hasDiscount()) return 0;
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }

  getPrimaryImage() {
    return this.images.find((img) => img.isPrimary) || this.images[0] || null;
  }

  canPurchase(quantity = 1) {
    return this.isActive && this.stockCount >= quantity;
  }

  updateStock(quantity) {
    this.stockCount = Math.max(0, this.stockCount + quantity);
  }

  updateRating(newRating, newReviewCount) {
    this.rating = parseFloat(newRating);
    this.reviewCount = parseInt(newReviewCount);
  }

  matchesSearch(searchTerm) {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      this.name.toLowerCase().includes(term) ||
      this.description?.toLowerCase().includes(term) ||
      this.tags.some((tag) => tag.toLowerCase().includes(term)) ||
      this.features.some((feature) => feature.toLowerCase().includes(term))
    );
  }

  matchesFilters(filters = {}) {
    const { categoryId, minPrice, maxPrice, inStock, featured, popular, tags } =
      filters;

    if (categoryId && this.categoryId !== categoryId) return false;
    if (minPrice && this.price < minPrice) return false;
    if (maxPrice && this.price > maxPrice) return false;
    if (inStock && !this.isInStock()) return false;
    if (featured && !this.isFeatured) return false;
    if (popular && !this.isPopular) return false;
    if (tags && tags.length > 0) {
      const hasMatchingTag = tags.some((tag) =>
        this.tags.includes(tag.toLowerCase())
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      categoryId: this.categoryId,
      category: this.category,
      price: this.price,
      originalPrice: this.originalPrice,
      sku: this.sku,
      stockCount: this.stockCount,
      isActive: this.isActive,
      isFeatured: this.isFeatured,
      isPopular: this.isPopular,
      weight: this.weight,
      dimensions: this.dimensions,
      images: this.images,
      features: this.features,
      tags: this.tags,
      rating: this.rating,
      reviewCount: this.reviewCount,
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription,
      discountPercentage: this.getDiscountPercentage(),
      inStock: this.isInStock(),
      primaryImage: this.getPrimaryImage(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromDatabase(row) {
    return new Product({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      categoryId: row.category_id,
      category: row.category,
      price: row.price,
      originalPrice: row.original_price,
      sku: row.sku,
      stockCount: row.stock_count,
      isActive: row.is_active,
      isFeatured: row.is_featured,
      isPopular: row.is_popular,
      weight: row.weight,
      dimensions: row.dimensions,
      images: row.images || [],
      features: row.features || [],
      tags: row.tags || [],
      rating: row.rating,
      reviewCount: row.review_count,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
