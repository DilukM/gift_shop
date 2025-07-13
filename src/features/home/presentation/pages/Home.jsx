import { motion } from "framer-motion";
import Hero from "../components/Hero";
import PopularProducts from "../../../products/presentation/components/PopularProducts";
import CategorySection from "../../../products/presentation/components/CategorySection";
import OffersSection from "../components/OffersSection";
import TestimonialsSection from "../components/TestimonialsSection";
import WhyChooseUs from "../components/WhyChooseUs";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <Hero />
      <PopularProducts />
      <CategorySection />
      <OffersSection />
      <WhyChooseUs />
      <TestimonialsSection />
    </motion.div>
  );
};

export default Home;
