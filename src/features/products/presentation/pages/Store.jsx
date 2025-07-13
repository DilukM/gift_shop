import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { useCart } from "../../../../shared/context/CartContext";
import productsData from "../../data/datasources/products.json";
import { Link } from "react-router-dom";

const Store = () => {
  const { category } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: "all", name: "All Products", count: productsData.products.length },
    ...productsData.categories.map((cat) => ({
      ...cat,
      count: productsData.products.filter((p) => p.category === cat.id).length,
    })),
  ];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
  ];

  useEffect(() => {
    setProducts(productsData.products);
    setFilteredProducts(productsData.products);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.id) - new Date(a.id));
        break;
      default:
        filtered.sort(
          (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, priceRange, sortBy]);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const getProductImage = (product) => {
    return product.image.replace(
      "/api/placeholder/400/400",
      product.category === "teddy-bears"
        ? "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
        : product.category === "bouquets"
        ? "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
        : "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-neutral-50 pt-20"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {selectedCategory === "all"
                ? "All Products"
                : categories.find((cat) => cat.id === selectedCategory)?.name ||
                  "Store"}
            </h1>
            <p className="text-xl text-white/90">
              Find the perfect graduation gift to celebrate their achievement
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div
            className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-primary-100 text-primary-700 font-medium"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{cat.name}</span>
                        <span className="text-sm text-neutral-400">
                          {cat.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-neutral-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden btn-secondary"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </button>
                  <span className="text-neutral-600">
                    {filteredProducts.length} products found
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* View Mode */}
                  <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-primary-600 text-white"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-primary-600 text-white"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <motion.div
              layout
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className={`card group ${
                    viewMode === "list" ? "flex flex-row" : ""
                  }`}
                >
                  {/* Product Image */}
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "list" ? "w-48 flex-shrink-0" : "w-full"
                    }`}
                  >
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                          viewMode === "list" ? "w-full h-full" : "w-full h-64"
                        }`}
                      />
                    </Link>

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-50 transition-colors"
                      >
                        <Heart className="w-5 h-5 text-neutral-600 hover:text-primary-600" />
                      </motion.button>
                    </div>

                    {/* Discount Badge */}
                    {product.originalPrice && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-600 text-white px-2 py-1 rounded-lg text-sm font-medium">
                          Save $
                          {(product.originalPrice - product.price).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-primary-600 font-medium capitalize">
                        {product.category.replace("-", " ")}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-neutral-600">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2 hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-primary-600">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-neutral-400 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500">
                          {product.reviews} reviews
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(product)}
                        className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* No Products Found */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-16 h-16 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No products found
                </h3>
                <p className="text-neutral-600 mb-6">
                  Try adjusting your search criteria or browse all products.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setPriceRange([0, 200]);
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Store;
