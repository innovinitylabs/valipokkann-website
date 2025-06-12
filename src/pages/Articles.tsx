import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';

interface ArticleMeta {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  date: string;
  category?: string;
}

interface Article {
  slug: string;
  meta: ArticleMeta;
  content: string;
}

// Simple frontmatter parser for browser environment
function parseFrontmatter(content: string): { meta: ArticleMeta; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('No frontmatter found in markdown file');
  }

  const [, frontmatter, markdownContent] = match;
  const meta: ArticleMeta = {
    title: '',
    description: '',
    date: '',
  };

  // Parse frontmatter key-value pairs
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      // Remove quotes if present
      const cleanValue = value.replace(/^["']|["']$/g, '');
      meta[key.trim() as keyof ArticleMeta] = cleanValue;
    }
  });

  return {
    meta,
    content: markdownContent.trim()
  };
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const modules = import.meta.glob<string>('../data/articles/*.md', { query: '?raw', import: 'default' });
    console.log('Found article modules:', Object.keys(modules));
    const loadArticles = async () => {
      try {
        const loaded: Article[] = await Promise.all(
          Object.entries(modules).map(async ([path, resolver]) => {
            console.log('Loading article from path:', path);
            const raw = await resolver() as string;
            const { meta, content } = parseFrontmatter(raw);
            const slug = path.split('/').pop()?.replace(/\.md$/, '') || '';
            console.log('Loaded article:', { slug, meta });
            return {
              slug,
              meta,
              content,
            };
          })
        );
        // Sort by date descending
        loaded.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
        console.log('All articles loaded:', loaded);
        setArticles(loaded);
      } catch (error) {
        console.error('Error loading articles:', error);
      }
    };
    loadArticles();
  }, []);

  // Get unique tags/categories from all articles
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(article => {
      if (article.meta.category) tags.add(article.meta.category);
    });
    return Array.from(tags).sort();
  }, [articles]);

  // Filter articles based on selected tag/category
  const filteredArticles = useMemo(() => {
    if (!selectedTag) return articles;
    return articles.filter(article => article.meta.category === selectedTag);
  }, [articles, selectedTag]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif mb-8 text-white">Articles</h1>

        {/* Tag Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                !selectedTag
                  ? 'bg-primary-dark text-white'
                  : 'bg-neutral-950 dark:bg-neutral-900 text-gray-300 hover:bg-neutral-900 dark:hover:bg-neutral-800'
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
                    : 'bg-neutral-950 dark:bg-neutral-900 text-gray-300 hover:bg-neutral-900 dark:hover:bg-neutral-800'
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
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-neutral-950 dark:bg-neutral-900 rounded-lg shadow-lg p-6 cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <h2 className="text-2xl font-serif mb-2 text-white">{article.meta.title}</h2>
              <p className="text-gray-400 mb-4">{article.meta.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {article.meta.category && (
                    <span
                      className="px-3 py-1 bg-neutral-900 dark:bg-neutral-800 rounded-full text-sm text-gray-300"
                    >
                      {article.meta.category}
                    </span>
                  )}
                </div>
                <time className="text-sm text-gray-400">{article.meta.date}</time>
              </div>
            </motion.article>
          ))}
        </div>

        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 overflow-y-auto"
            onClick={() => setSelectedArticle(null)}
          >
            <div
              className="relative w-full max-w-3xl md:max-w-4xl bg-neutral-950 dark:bg-neutral-900 rounded-lg mx-2 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-neutral-950 dark:bg-neutral-900 p-6 border-b border-neutral-800 rounded-t-lg">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setSelectedArticle(null)}
                >
                  ✕
                </button>
                <h2 className="text-3xl font-serif mb-4 text-white pr-8">{selectedArticle.meta.title}</h2>
                <div className="flex items-center space-x-4 mb-2">
                  <time className="text-gray-400">{selectedArticle.meta.date}</time>
                  {selectedArticle.meta.category && (
                    <span
                      className="px-3 py-1 bg-neutral-900 dark:bg-neutral-800 rounded-full text-sm text-gray-300"
                    >
                      {selectedArticle.meta.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-16rem)]">
                <article 
                  className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-headings:text-white prose-p:text-gray-300 prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary-dark prose-strong:text-white prose-code:text-green-400 prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral-800 prose-pre:text-gray-200 prose-blockquote:border-l-primary prose-blockquote:text-gray-400 prose-img:rounded-lg prose-img:shadow-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: marked(selectedArticle.content, {
                      breaks: true,
                      gfm: true
                    }) 
                  }} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Articles; 