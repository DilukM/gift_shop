import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar, Footer, CartProvider } from "./shared";
import { Home } from "./features/home";
import { Store, Gallery, ProductDetails } from "./features/products";
import { Contact } from "./features/contact";
import { CartPage, Checkout } from "./features/cart";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/store" element={<Store />} />
              <Route path="/store/:category" element={<Store />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
