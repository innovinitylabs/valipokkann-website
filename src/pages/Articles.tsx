import { useState } from 'react';
import { motion } from 'framer-motion';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  tags: string[];
}

const Articles = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Sample articles data
  const articles: Article[] = [
    {
      id: 1,
      title: 'The Intersection of Art and Revolution',
      excerpt: 'Exploring how art can be a powerful tool for social change and cultural transformation.',
      date: '2024-03-15',
      content: '# The Intersection of Art and Revolution\n\nArt has always been a mirror of society...',
      tags: ['Art', 'Revolution', 'Culture']
    },
    // Add more articles here
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif mb-8">Articles</h1>

        <div className="space-y-8">
          {articles.map((article) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <h2 className="text-2xl font-serif mb-2">{article.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <time className="text-sm text-gray-500">{article.date}</time>
              </div>
            </motion.article>
          ))}
        </div>

        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
            onClick={() => setSelectedArticle(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setSelectedArticle(null)}
              >
                ✕
              </button>
              
              <h2 className="text-3xl font-serif mb-4">{selectedArticle.title}</h2>
              <div className="flex items-center space-x-4 mb-6">
                <time className="text-gray-500">{selectedArticle.date}</time>
                <div className="flex space-x-2">
                  {selectedArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                {/* Here you would render the markdown content */}
                <p>{selectedArticle.content}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Articles; 