import { useState, useMemo } from 'react';
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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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
    {
      id: 2,
      title: 'Tamil Literature in Modern Times',
      excerpt: 'A deep dive into the evolution of Tamil literature and its impact on contemporary society.',
      date: '2024-03-10',
      content: '# Tamil Literature in Modern Times\n\nTamil literature has a rich history...',
      tags: ['Literature', 'Culture', 'Tamil']
    },
    {
      id: 3,
      title: 'Digital Art and Traditional Techniques',
      excerpt: 'Bridging the gap between traditional artistic methods and modern digital tools.',
      date: '2024-03-05',
      content: '# Digital Art and Traditional Techniques\n\nThe digital age has transformed art...',
      tags: ['Art', 'Technology', 'Digital']
    },
    {
      id: 4,
      title: 'Cultural Identity in Contemporary Art',
      excerpt: 'Examining how artists express and preserve cultural identity through their work.',
      date: '2024-02-28',
      content: '# Cultural Identity in Contemporary Art\n\nCultural identity plays a crucial role...',
      tags: ['Culture', 'Art', 'Identity']
    }
  ];

  // Get unique tags from all articles
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(article => {
      article.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [articles]);

  // Filter articles based on selected tag
  const filteredArticles = useMemo(() => {
    if (!selectedTag) return articles;
    return articles.filter(article => article.tags.includes(selectedTag));
  }, [articles, selectedTag]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif mb-8">Articles</h1>

        {/* Tag Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                !selectedTag
                  ? 'bg-primary-dark text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                  selectedTag === tag
                    ? 'bg-primary-dark text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {filteredArticles.map((article) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <h2 className="text-2xl font-serif mb-2">{article.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
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
              className="bg-white dark:bg-gray-900 rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
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
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
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