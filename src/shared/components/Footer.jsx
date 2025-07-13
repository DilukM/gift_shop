import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "Store", href: "/store" },
        { name: "Gallery", href: "/gallery" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Categories",
      links: [
        { name: "Graduation Bears", href: "/store/teddy-bears" },
        { name: "Flower Bouquets", href: "/store/bouquets" },
        { name: "Gift Combos", href: "/store/combo" },
        { name: "Custom Orders", href: "/contact" },
      ],
    },
    {
      title: "Customer Care",
      links: [
        { name: "Shipping Info", href: "#" },
        { name: "Return Policy", href: "#" },
        { name: "Size Guide", href: "#" },
        { name: "FAQ", href: "#" },
      ],
    },
  ];

  const contactInfo = [
    { icon: Phone, text: "+1 (555) 123-4567" },
    { icon: Mail, text: "hello@giftbloom.com" },
    { icon: MapPin, text: "123 Gift Street, Bloom City" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Twitter, href: "#", name: "Twitter" },
  ];

  return (
    <footer className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center"
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold text-white">GiftBloom</span>
            </Link>

            <p className="text-neutral-300 max-w-md leading-relaxed">
              Celebrating life's special moments with beautiful graduation teddy
              bears and fresh flower bouquets. Making memories that last a
              lifetime.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-neutral-300"
                >
                  <item.icon className="w-5 h-5 text-primary-400" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-neutral-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-neutral-300 hover:text-primary-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-neutral-300">
                Get the latest offers and graduation gift ideas delivered to
                your inbox.
              </p>
            </div>

            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-l-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-r-lg transition-colors duration-200"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-neutral-400">
            <p>&copy; 2025 GiftBloom. All rights reserved.</p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <Link to="#" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="hover:text-primary-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
