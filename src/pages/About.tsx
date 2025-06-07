import { motion } from 'framer-motion';
import { useState } from 'react';

const About = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [logoRotation, setLogoRotation] = useState(0);

  const handleLogoClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const imageRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX;
    const imageCenterX = imageRect.left + imageRect.width / 2;

    if (clickX > imageCenterX) {
      // Clicked on the right half
      setLogoRotation(prev => prev + 360);
    } else {
      // Clicked on the left half
      setLogoRotation(prev => prev - 360);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl font-sans mb-8 cursor-pointer"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            animate={{ 
              // fontFamily: isHovered ? "'Noto Serif Tamil', serif" : "'Inter', sans-serif"
            }}
            transition={{ duration: 0.3 }}
          >
            About {isHovered ? 'வழிப்போக்கன்' : 'VALIPOKKANN'}
          </motion.h1>
          
          <div className="grid grid-cols-1 gap-12">
            <div>
              <motion.div 
                className="w-64 h-64 mx-auto bg-black dark:bg-black rounded-lg mb-6 overflow-hidden flex justify-center items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img 
                  src="/valipokkann_transparent_logo.png" 
                  alt="VALIPOKKANN Logo" 
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={handleLogoClick}
                  animate={{ rotate: logoRotation }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </motion.div>
              <h2 className="text-2xl font-sans mb-4">Artist Bio</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Valipokkann creates as the ancients did — not by copying what is seen, but by invoking what is known. Each canvas is a confrontation, not a decoration.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                VALIPOKKANN is an artist whose work is raw, figurative-abstract, and fiercely original — unpolished, uncategorized, and unafraid. They create without reference, imitation, or borrowed aesthetics; each piece emerges from an inner well of form and force, drawn not from outside inspiration but ancestral memory and lived intensity.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Their art defies gravity itself — omnivalient and multidimensional, revealing hidden layers and meanings when flipped, rotated, or reinterpreted.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Rooted deeply in Tamil philosophy and the fire of Thirukkural, VALIPOKKANN channels traditional knowledge into a new visual language. Across mediums — painting, photography, music, and writing — their work challenges trends, confronts shallow modernity, and refuses to be diluted.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Made not to impress, but to reveal.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-sans mt-8 mb-4">Connect</h2>
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