import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

const Fusion = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const projects = [
    {
      id: 'brahmamuhurtham',
      title: 'Brahma Muhurtham',
      description: 'A spiritual alarm clock that helps you wake up during Brahma Muhurtham, the auspicious time before sunrise.',
      path: '/fusion/brahmamuhurtham',
      color: 'from-purple-500 to-indigo-600'
    },
    // Add more projects here as they are developed
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Fusion - Art, Tech & Culture Experiments | VALIPOKKANN</title>
        <meta name="description" content="Explore experimental projects at the intersection of art, technology, and culture. Discover innovative tools and experiences that bridge tradition and modernity." />
        <meta name="keywords" content="VALIPOKKANN, fusion, art, technology, culture, experiments, digital art, interactive" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://valipokkann.in/fusion" />
        <meta property="og:title" content="Fusion - Art, Tech & Culture Experiments | VALIPOKKANN" />
        <meta property="og:description" content="Explore experimental projects at the intersection of art, technology, and culture." />
        <meta property="og:image" content="https://valipokkann.in/valipokkann_transparent_logo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://valipokkann.in/fusion" />
        <meta property="twitter:title" content="Fusion - Art, Tech & Culture Experiments | VALIPOKKANN" />
        <meta property="twitter:description" content="Explore experimental projects at the intersection of art, technology, and culture." />
        <meta property="twitter:image" content="https://valipokkann.in/valipokkann_transparent_logo.png" />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Fusion
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Where art, technology, and culture converge to create innovative experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onHoverStart={() => setHoveredProject(project.id)}
              onHoverEnd={() => setHoveredProject(null)}
              className="relative group"
            >
              <Link to={project.path} className="block">
                <div className={`rounded-lg overflow-hidden bg-gradient-to-br ${project.color} p-1`}>
                  <div className="bg-black rounded-lg p-6 h-full">
                    <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
                    <p className="text-gray-400">{project.description}</p>
                    <div className="mt-4 flex items-center text-sm text-purple-400">
                      <span>Explore Project</span>
                      <svg
                        className={`w-4 h-4 ml-2 transform transition-transform ${
                          hoveredProject === project.id ? 'translate-x-1' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 text-center text-gray-500"
        >
          <p>More experiments coming soon...</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Fusion; 