import React from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

const Footer = () => {
  const navLinks = [
    { name: 'Events', href: '#events' },
    { name: 'Workshops', href: '#workshops' },
    { name: 'About', href: '#about' },
    { name: 'Contact Us', href: '#contactus' },
  ];

  return (
    <footer className="bg-[#030712] text-gray-400 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          {/* Organization Icon */}
          <motion.div
            className="flex items-center space-x-2 text-cyan-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="https://srmrmp.edu.in/wp-content/uploads/2022/01/IST-183x70-3.png" 
              alt="Organization Icon" 
              className="w-full h-full rounded-full"
            />
            <span className="font-bold text-lg">InBot</span>
          </motion.div>

          {/* Footer Navigation Links */}
          <motion.div
            className="flex space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-cyan-400 hover:text-cyan-500 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </motion.div>

          {/* InBot Logo and Social Icons */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="https://www.instagram.com" // Replace with your Instagram link
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-500 transition-colors"
            >
              <Instagram size={24} />
            </a>
            <img 
              src="/intbotlogo.png" 
              alt="InBot Logo" 
              className="w-full h-20"
            />
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
