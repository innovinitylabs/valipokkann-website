import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Helmet>
        <title>404 Not Found | VALIPOKKANN</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="The page you are looking for does not exist on VALIPOKKANN." />
        <meta property="og:title" content="404 Not Found | VALIPOKKANN" />
        <meta property="og:description" content="The page you are looking for does not exist on VALIPOKKANN." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://valipokkan.in/404" />
        <meta property="og:image" content="https://valipokkan.in/valipokkann_transparent_logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="404 Not Found | VALIPOKKANN" />
        <meta name="twitter:description" content="The page you are looking for does not exist on VALIPOKKANN." />
        <meta name="twitter:image" content="https://valipokkan.in/valipokkann_transparent_logo.png" />
        <link rel="canonical" href="https://valipokkan.in/404" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-6xl font-serif mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="btn-primary"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound; 