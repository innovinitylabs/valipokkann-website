import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <footer className="bg-gray-100 dark:bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <motion.h3 
              className="text-lg font-semibold mb-4 cursor-pointer"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              animate={{ 
                fontFamily: isHovered ? "'Noto Serif Tamil', serif" : "'Inter', sans-serif"
              }}
              transition={{ duration: 0.3 }}
            >
              {isHovered ? 'வழிப்போக்கன்' : 'VALIPOKKANN'}
            </motion.h3>
            <p className="text-gray-600 dark:text-gray-400">
              Exploring the intersection of art, culture, and revolution.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/art" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Art Gallery
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://instagram.com/valipokkann"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/valipokkann"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {currentYear} <motion.span
              className="cursor-pointer"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              animate={{ 
                fontFamily: isHovered ? "'Noto Serif Tamil', serif" : "'Inter', sans-serif"
              }}
              transition={{ duration: 0.3 }}
            >
              {isHovered ? 'வழிப்போக்கன்' : 'VALIPOKKANN'}
            </motion.span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 