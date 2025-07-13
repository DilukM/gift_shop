/**
 * Product Domain Entity
 * Represents a product in the gift shop
 */
export class Product {
  constructor({
    id,
    name,
    category,
    price,
    originalPrice,
    description,
    image,
    images = [],
    features = [],
    inStock = true,
    rating = 0,
    reviews = 0,
    isNew = false,
    isBestSeller = false,
  }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.originalPrice = originalPrice;
    this.description = description;
    this.image = image;
    this.images = images;
    this.features = features;
    this.inStock = inStock;
    this.rating = rating;
    this.reviews = reviews;
    this.isNew = isNew;
    this.isBestSeller = isBestSeller;
  }

  /**
   * Calculate discount percentage
   * @returns {number} Discount percentage
   */
  getDiscountPercentage() {
    if (!this.originalPrice || this.originalPrice <= this.price) {
      return 0;
    }
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }

  /**
   * Check if product is on sale
   * @returns {boolean} True if product has discount
   */
  isOnSale() {
    return this.getDiscountPercentage() > 0;
  }

  /**
   * Get formatted price
   * @returns {string} Formatted price string
   */
  getFormattedPrice() {
    return `$${this.price.toFixed(2)}`;
  }

  /**
   * Get formatted original price
   * @returns {string} Formatted original price string
   */
  getFormattedOriginalPrice() {
    return this.originalPrice ? `$${this.originalPrice.toFixed(2)}` : null;
  }

  /**
   * Check if product matches search criteria
   * @param {string} searchTerm Search term
   * @returns {boolean} True if product matches
   */
  matchesSearch(searchTerm) {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      this.name.toLowerCase().includes(term) ||
      this.description.toLowerCase().includes(term) ||
      this.category.toLowerCase().includes(term) ||
      this.features.some((feature) => feature.toLowerCase().includes(term))
    );
  }

  /**
   * Check if product is in price range
   * @param {number} minPrice Minimum price
   * @param {number} maxPrice Maximum price
   * @returns {boolean} True if product is in range
   */
  isInPriceRange(minPrice, maxPrice) {
    return this.price >= minPrice && this.price <= maxPrice;
  }
}
