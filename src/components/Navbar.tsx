import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar = ({ isDarkMode, toggleTheme }: NavbarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/art', label: 'Art' },
    { path: '/articles', label: 'Articles' },
    { path: '/music', label: 'Music' },
    { path: '/links', label: 'Links' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className="bg-white dark:bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <motion.span 
                className="text-2xl font-serif text-primary cursor-pointer"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                animate={{ 
                  fontFamily: isHovered ? "'Noto Serif Tamil', serif" : "'Inter', sans-serif"
                }}
                transition={{ duration: 0.3 }}
              >
                {isHovered ? 'வழிப்போக்கன்' : 'VALIPOKKANN'}
              </motion.span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="nav-link"
              >
                {item.label}
              </Link>
            ))}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 