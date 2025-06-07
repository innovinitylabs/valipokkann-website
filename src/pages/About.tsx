import { motion } from 'framer-motion';
import { useState } from 'react';

const About = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl font-serif mb-8 cursor-pointer"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            animate={{ 
              fontFamily: isHovered ? "'Noto Serif Tamil', serif" : "'Inter', sans-serif"
            }}
            transition={{ duration: 0.3 }}
          >
            About {isHovered ? 'வழிப்போக்கன்' : 'VALIPOKKANN'}
          </motion.h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <motion.div 
                className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="/valipokkann_transparent_logo.png" 
                  alt="VALIPOKKANN Logo" 
                  className="w-full h-full object-contain p-8"
                />
              </motion.div>
              <h2 className="text-2xl font-serif mb-4">Artist Bio</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                VALIPOKKANN is an artist whose work explores the intersection of traditional Indian aesthetics
                and contemporary artistic expression. Through various mediums, they create pieces that challenge
                conventional perspectives and celebrate cultural heritage.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Their art is a reflection of personal experiences, cultural identity, and social commentary,
                often incorporating elements of Tamil literature and philosophy.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-serif mb-4">Values & Vision</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    Embracing cultural heritage while pushing artistic boundaries
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    Creating art that sparks dialogue and challenges perspectives
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    Exploring the relationship between tradition and innovation
                  </p>
                </li>
              </ul>
              
              <h2 className="text-2xl font-serif mt-8 mb-4">Connect</h2>
              <div className="space-y-4">
                <a
                  href="mailto:valipokkann@proton.me"
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  valipokkann@proton.me
                </a>
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com/valipokkann"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://twitter.com/valipokkann"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 