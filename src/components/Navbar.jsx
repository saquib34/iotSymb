import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ['Events', 'WorkShops', 'About', 'Contact Us'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50  backdrop-blur-md border-b border-cyan-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div 
            className="text-cyan-400 text-xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Intbot'25
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-cyan-200 hover:text-cyan-400 transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-cyan-400 relative z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />} 
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
          initial={false}
          animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        >
          <div className="py-4">
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block py-2 text-cyan-200 hover:text-cyan-400"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
