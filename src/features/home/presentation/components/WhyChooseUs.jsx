import { motion } from "framer-motion";
import { Truck, Shield, Heart, Award, Clock, Users } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Same-day and next-day delivery options available for last-minute celebrations.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description:
        "Premium materials and fresh flowers with 100% satisfaction guarantee.",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Heart,
      title: "Made with Love",
      description:
        "Each gift is carefully crafted with attention to detail and genuine care.",
      color: "text-primary-600",
      bgColor: "bg-primary-50",
    },
    {
      icon: Award,
      title: "Award Winning",
      description:
        "Recognized for excellence in graduation gifts and customer service.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support for all your gift-giving needs.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Users,
      title: "Trusted by 1000s",
      description:
        "Over 5000 happy families have celebrated with our graduation gifts.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="section-padding bg-gradient-to-br from-neutral-50 to-white">
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
            Why <span className="gradient-text">Choose Us</span>
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            We're committed to making your graduation celebrations unforgettable
            with exceptional service and quality gifts.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-luxury transition-all duration-300 border border-neutral-100"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6`}
              >
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </motion.div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-neutral-900">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect */}
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                className="h-1 bg-gradient-to-r from-primary-600 to-primary-800 rounded-full mt-6"
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 lg:p-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "5000+", label: "Happy Graduates" },
              { number: "4.9/5", label: "Customer Rating" },
              { number: "24h", label: "Fast Delivery" },
              { number: "100%", label: "Satisfaction" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                className="space-y-2"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-3xl lg:text-4xl font-bold"
                >
                  {stat.number}
                </motion.div>
                <div className="text-white/90 text-sm lg:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
