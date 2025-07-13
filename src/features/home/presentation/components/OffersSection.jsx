import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Gift, Percent, ArrowRight } from "lucide-react";

const OffersSection = () => {
  const offers = [
    {
      id: 1,
      title: "Graduation Special",
      subtitle: "20% Off All Teddy Bears",
      description:
        "Celebrate academic achievements with our cuddly graduation bears at special prices.",
      discount: "20% OFF",
      code: "GRAD2025",
      bgColor: "from-primary-600 to-primary-800",
      icon: Gift,
      cta: "Shop Bears",
      link: "/store/teddy-bears",
    },
    {
      id: 2,
      title: "Flower Power",
      subtitle: "Buy 2 Get 1 Free",
      description:
        "Mix and match beautiful bouquets for multiple graduates in your life.",
      discount: "BOGO",
      code: "FLOWERS3",
      bgColor: "from-secondary-500 to-secondary-700",
      icon: Percent,
      cta: "Shop Bouquets",
      link: "/store/bouquets",
    },
    {
      id: 3,
      title: "Limited Time",
      subtitle: "Free Shipping Over $75",
      description:
        "Get your graduation gifts delivered free when you spend $75 or more.",
      discount: "FREE SHIP",
      code: "SHIP75",
      bgColor: "from-neutral-700 to-neutral-900",
      icon: Clock,
      cta: "Shop Now",
      link: "/store",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
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
            Special <span className="gradient-text">Offers</span>
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Don't miss out on these limited-time deals to make your graduation
            celebrations even more special.
          </p>
        </motion.div>

        {/* Offers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative overflow-hidden rounded-3xl shadow-luxury hover:shadow-luxury-lg transition-all duration-300"
            >
              <Link to={offer.link}>
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${offer.bgColor}`}
                />

                {/* Content */}
                <div className="relative p-8 text-white">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6"
                  >
                    <offer.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Discount Badge */}
                  <div className="absolute top-6 right-6">
                    <motion.div
                      initial={{ rotate: -10 }}
                      whileHover={{ rotate: 0 }}
                      className="bg-white text-neutral-900 px-3 py-1 rounded-full text-sm font-bold"
                    >
                      {offer.discount}
                    </motion.div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{offer.title}</h3>
                    <h4 className="text-lg font-medium text-white/90">
                      {offer.subtitle}
                    </h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  {/* Promo Code */}
                  <div className="mt-6 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80">Use code:</span>
                      <span className="text-lg font-mono font-bold">
                        {offer.code}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="mt-6 flex items-center justify-between text-white group-hover:text-secondary-200 transition-colors"
                  >
                    <span className="font-medium">{offer.cta}</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 lg:p-12 text-center text-white"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Gift className="w-8 h-8 text-white" />
          </motion.div>

          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Never Miss a Special Offer
          </h3>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Be the first to know about exclusive deals, new products, and
            graduation season specials. Join our community of gift-givers!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OffersSection;
