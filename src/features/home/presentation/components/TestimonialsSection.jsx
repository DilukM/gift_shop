import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Proud Mother",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b17c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The graduation bear we ordered for our daughter was absolutely perfect! The quality was amazing and the personalized touch made it extra special. She still treasures it.",
      graduation: "MBA Graduation 2024",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Graduate",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "I was surprised with the most beautiful rose bouquet for my engineering graduation. The flowers were fresh and the arrangement was stunning. Made my day even more memorable!",
      graduation: "Engineering Graduation 2024",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Grandmother",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Ordered the graduate special combo for my granddaughter. The customer service was exceptional and the delivery was right on time. Highly recommend!",
      graduation: "High School Graduation 2024",
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Father",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The custom teddy bear with my son's name embroidered was exactly what we wanted. The attention to detail and quality exceeded our expectations. Will definitely order again!",
      graduation: "Medical School Graduation 2024",
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
            What Our <span className="gradient-text">Customers Say</span>
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what families across the
            country are saying about their GiftBloom experience.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-white to-primary-50 rounded-2xl p-8 shadow-lg hover:shadow-luxury transition-all duration-300 border border-primary-100 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-primary-200">
                <Quote className="w-8 h-8" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-neutral-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center space-x-4">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover shadow-md"
                />
                <div>
                  <h4 className="font-semibold text-neutral-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-neutral-600">{testimonial.role}</p>
                  <p className="text-xs text-primary-600 font-medium">
                    {testimonial.graduation}
                  </p>
                </div>
              </div>

              {/* Decorative gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-600/20 to-secondary-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 lg:p-12 text-white">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Star className="w-8 h-8 text-white" />
            </motion.div>

            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Join Thousands of Happy Families
            </h3>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Ready to create beautiful graduation memories? Browse our
              collection and find the perfect gift to celebrate your graduate's
              achievement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
              >
                Shop Graduation Gifts
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors"
              >
                Read More Reviews
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
