import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogoClick = () => {
    setRotation(prevRotation => prevRotation - 90);
  };

  return (
    <>
      <Helmet>
        <title>VALIPOKKANN - Artist • Revolutionary • Visionary</title>
        <meta name="description" content="VALIPOKKANN - A contemporary artist, revolutionary, and visionary exploring the intersection of art, technology, and social change." />
        <meta name="keywords" content="VALIPOKKANN, artist, revolutionary, visionary, contemporary art, digital art, photography" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://valipokkann.in/" />
        <meta property="og:title" content="VALIPOKKANN - Artist • Revolutionary • Visionary" />
        <meta property="og:description" content="Explore the world of VALIPOKKANN - A contemporary artist, revolutionary, and visionary exploring the intersection of art, technology, and social change." />
        <meta property="og:image" content="https://valipokkann.in/valipokkann_transparent_logo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://valipokkann.in/" />
        <meta property="twitter:title" content="VALIPOKKANN - Artist • Revolutionary • Visionary" />
        <meta property="twitter:description" content="Explore the world of VALIPOKKANN - A contemporary artist, revolutionary, and visionary exploring the intersection of art, technology, and social change." />
        <meta property="twitter:image" content="https://valipokkann.in/valipokkann_transparent_logo.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "VALIPOKKANN",
            "url": "https://valipokkann.in",
            "image": "https://valipokkann.in/valipokkann_transparent_logo.png",
            "sameAs": [
              "https://github.com/valipokkann",
              "https://instagram.com/valipokkann"
            ],
            "jobTitle": "Artist",
            "description": "A contemporary artist, revolutionary, and visionary exploring the intersection of art, technology, and social change.",
            "worksFor": {
              "@type": "Organization",
              "name": "VALIPOKKANN"
            }
          })}
        </script>
      </Helmet>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <motion.img
              src="/valipokkann_transparent_logo.png"
              alt="VALIPOKKANN Logo"
              className="w-48 h-48 mx-auto mb-8 cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: rotation
              }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onClick={handleLogoClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
            <motion.h1 
              className="text-5xl md:text-7xl font-serif mb-6 text-gray-900 dark:text-white cursor-pointer"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              animate={{ 
                fontFamily: isHovered ? "'Noto Serif Tamil', serif" : "'Inter', sans-serif"
              }}
              transition={{ duration: 0.3 }}
            >
              {isHovered ? 'வழிப்போக்கன்' : 'VALIPOKKANN'}
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              Artist • Revolutionary • Visionary
            </p>
            <div className="space-x-4">
              <Link
                to="/art"
                className="btn-primary"
              >
                View Art
              </Link>
              <Link
                to="/about"
                className="px-6 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-md transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Featured Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif text-center mb-12">Featured Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Featured Art */}
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-neutral-950 dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img src="/valipokkann_transparent_logo.png" alt="Featured Art" className="object-cover w-full h-full" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Latest Artwork</h3>
                  <p className="text-gray-400 mb-4">
                    Explore the latest creation from VALIPOKKANN's studio.
                  </p>
                  <Link
                    to="/art"
                    className="text-primary hover:text-primary-dark"
                  >
                    View Art →
                  </Link>
                </div>
              </motion.div>

              {/* Featured Article */}
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-neutral-950 dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img src="/valipokkann_transparent_logo.png" alt="Featured Article" className="object-cover w-full h-full" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Latest Article</h3>
                  <p className="text-gray-400 mb-4">
                    Read VALIPOKKANN's thoughts on art and revolution.
                  </p>
                  <Link
                    to="/articles"
                    className="text-primary hover:text-primary-dark"
                  >
                    Read More →
                  </Link>
                </div>
              </motion.div>

              {/* Featured Music */}
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-neutral-950 dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img src="/valipokkann_transparent_logo.png" alt="Featured Music" className="object-cover w-full h-full" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Coming Soon</h3>
                  <p className="text-gray-400 mb-4">
                    Music and soundscapes from VALIPOKKANN's creative universe.
                  </p>
                  <Link
                    to="/music"
                    className="text-primary hover:text-primary-dark"
                  >
                    Learn More →
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home; 