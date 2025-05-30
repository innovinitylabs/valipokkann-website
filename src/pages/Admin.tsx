import { useState } from 'react';
import { motion } from 'framer-motion';

interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  published: boolean;
}

const Admin = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({
    title: '',
    content: '',
    tags: [],
    published: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newArticle: Article = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...currentArticle as Omit<Article, 'id' | 'date'>
    };
    setArticles([...articles, newArticle]);
    setCurrentArticle({
      title: '',
      content: '',
      tags: [],
      published: false
    });
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !currentArticle.tags?.includes(newTag)) {
        setCurrentArticle({
          ...currentArticle,
          tags: [...(currentArticle.tags || []), newTag]
        });
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentArticle({
      ...currentArticle,
      tags: currentArticle.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-serif mb-8">Admin Dashboard</h1>

          {/* Article Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-serif mb-4">Create New Article</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={currentArticle.title}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">
                  Content (Markdown)
                </label>
                <textarea
                  id="content"
                  value={currentArticle.content}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 h-48"
                  required
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-1">
                  Tags (Press Enter to add)
                </label>
                <input
                  type="text"
                  id="tags"
                  onKeyDown={handleTagInput}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentArticle.tags?.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary hover:text-primary-dark"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={currentArticle.published}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, published: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Publish immediately
                </label>
              </div>

              <button
                type="submit"
                className="btn-primary"
              >
                Create Article
              </button>
            </div>
          </form>

          {/* Articles List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-serif mb-4">Articles</h2>
            <div className="space-y-4">
              {articles.map(article => (
                <div
                  key={article.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{article.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(article.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        article.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {article.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin; 