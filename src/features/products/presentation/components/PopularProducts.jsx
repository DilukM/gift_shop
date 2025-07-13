import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingBag, Heart, Check } from "lucide-react";
import { useCart } from "../../../../shared/context/CartContext";
import productsData from "../../data/datasources/products.json";
import { useState } from "react";

const PopularProducts = () => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState(new Set());
  const popularProducts = productsData.products
    .filter((product) => product.isPopular)
    .slice(0, 6);

  const handleAddToCart = async (product) => {
    const success = await addToCart(product);
    if (success) {
      setAddedItems((prev) => new Set([...prev, product.id]));
      // Remove the success indicator after 2 seconds
      setTimeout(() => {
        setAddedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
      }, 2000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Popular <span className="gradient-text">Graduation Gifts</span>
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover our most loved graduation gifts that create lasting
            memories and celebrate achievements in style.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {popularProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="card group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image.replace(
                      "/api/placeholder/400/400",
                      product.category === "teddy-bears"
                        ? "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                        : "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                    )}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
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
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
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
                    className={`${
                      addedItems.has(product.id)
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-primary-600 hover:bg-primary-700"
                    } text-white p-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg`}
                  >
                    {addedItems.has(product.id) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <ShoppingBag className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/store">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary group inline-flex items-center justify-center"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularProducts;
