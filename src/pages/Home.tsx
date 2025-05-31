import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-gray-900 dark:text-white">
            Valipokkann
          </h1>
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
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Latest Artwork</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Explore the latest creation from Valipokkann's studio.
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
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Latest Article</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Read Valipokkann's thoughts on art and revolution.
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
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Music and soundscapes from Valipokkann's creative universe.
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
  );
};

export default Home; 