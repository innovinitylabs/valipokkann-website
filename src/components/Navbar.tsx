import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar = ({ isDarkMode, toggleDarkMode }: NavbarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Art', path: '/art' },
    { name: 'Photography', path: '/photography' },
    { name: 'Music', path: '/music' },
    { name: 'Thirukkural', path: '/thirukkural' },
    { name: 'Articles', path: '/articles' },
    { name: 'About', path: '/about' },
    { name: 'Links', path: '/links' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

          {/* Desktop Menu and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4">
              <NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                Home
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                About
              </NavLink>
              <NavLink to="/articles" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                Articles
              </NavLink>
              <NavLink to="/music" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                Music
              </NavLink>
              <NavLink to="/art" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                Art
              </NavLink>
              <NavLink to="/thirukkural" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                Thirukkural
              </NavLink>
              <NavLink to="/links" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                Links
              </NavLink>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                // Close icon (e.g., an X)
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            {/* Theme Toggle for Mobile - can be placed here if needed, or within mobile menu */}
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-black shadow-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="flex space-x-4">
                <NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                  Home
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                  About
                </NavLink>
                <NavLink to="/articles" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                  Articles
                </NavLink>
                <NavLink to="/music" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                  Music
                </NavLink>
                <NavLink to="/art" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                  Art
                </NavLink>
                <NavLink to="/thirukkural" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                  Thirukkural
                </NavLink>
                <NavLink to="/links" className={({ isActive }) => isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}>
                  Links
                </NavLink>
              </div>
              {/* Mobile Dark Mode Toggle - example placement */}
              <button
                onClick={() => { toggleDarkMode(); toggleMobileMenu(); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {isDarkMode ? 'Switch to Light Mode 🌞' : 'Switch to Dark Mode 🌙'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 