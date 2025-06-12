import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import { Helmet } from 'react-helmet-async';
import StructuredData from '../components/StructuredData';

interface ArticleMeta {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  date: string;
  tags?: string[];  // Changed from category to tags array
  coverImage?: string;  // Path to the cover image
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
  const meta: Partial<ArticleMeta> = {
    title: '',
    description: '',
    date: '',
  };

  // Parse frontmatter key-value pairs
  let currentKey = '';
  let isInTagsList = false;
  const tags: string[] = [];

  frontmatter.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      isInTagsList = false;
      return;
    }

    // Check if we're starting a tags list
    if (trimmedLine === 'tags:') {
      isInTagsList = true;
      return;
    }

    // If we're in a tags list
    if (isInTagsList) {
      if (trimmedLine.startsWith('- ')) {
        // This is a tag
        tags.push(trimmedLine.substring(2));
        return;
      }
      isInTagsList = false;
    }

    // Regular key-value parsing
    if (!isInTagsList) {
      const [key, ...valueParts] = trimmedLine.split(':');
      if (key && valueParts.length > 0) {
        currentKey = key.trim();
        const value = valueParts.join(':').trim();
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '');
        
        // Handle different field types
        switch (currentKey) {
          case 'tags':
            // Skip tags here as we handle them separately
            break;
          case 'coverImage':
            meta.coverImage = cleanValue;
            break;
          default:
            if (currentKey !== 'tags') {
              meta[currentKey as keyof Omit<ArticleMeta, 'tags' | 'coverImage'>] = cleanValue;
            }
        }
      }
    }
  });

  // Add tags to meta if we found any
  if (tags.length > 0) {
    meta.tags = tags;
  }

  console.log('Parsed frontmatter:', { meta, tags });
  return {
    meta: meta as ArticleMeta,
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
            console.log('Loaded article:', { 
              slug, 
              meta,
              coverImage: meta.coverImage,
              hasCoverImage: !!meta.coverImage 
            });
            return {
              slug,
              meta,
              content,
            };
          })
        );
        // Sort by date descending
        loaded.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
        console.log('All articles loaded:', loaded.map(a => ({ 
          title: a.meta.title, 
          coverImage: a.meta.coverImage,
          hasCoverImage: !!a.meta.coverImage 
        })));
        setArticles(loaded);
      } catch (error) {
        console.error('Error loading articles:', error);
      }
    };
    loadArticles();
  }, []);

  // Get unique tags from all articles
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(article => {
      article.meta.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [articles]);

  // Filter articles based on selected tag
  const filteredArticles = useMemo(() => {
    if (!selectedTag) return articles;
    return articles.filter(article => 
      Array.isArray(article.meta.tags) && article.meta.tags.includes(selectedTag)
    );
  }, [articles, selectedTag]);

  // Prepare structured data for the articles page
  const articlesPageData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "VALIPOKKANN Articles",
    "description": "Explore articles on art, philosophy, and cultural heritage by VALIPOKKANN. Discover insights into Tamil philosophy, mathematics, and the intersection of traditional wisdom with modern thought.",
    "url": "https://valipokkann.com/articles",
    "author": {
      "@type": "Person",
      "name": "VALIPOKKANN",
      "alternateName": "வழிப்போக்கன்"
    },
    "blogPost": articles.map(article => ({
      "@type": "BlogPosting",
      "headline": article.meta.title,
      "description": article.meta.description,
      "datePublished": article.meta.date,
      "author": {
        "@type": "Person",
        "name": article.meta.author || "VALIPOKKANN"
      },
      "keywords": article.meta.keywords,
      "image": article.meta.coverImage ? `https://valipokkann.com${article.meta.coverImage}` : undefined,
      "url": `https://valipokkann.com/articles/${article.slug}`
    }))
  }), [articles]);

  return (
    <>
      <Helmet>
        <title>Articles | VALIPOKKANN</title>
        <meta name="description" content="Explore articles on art, philosophy, and cultural heritage by VALIPOKKANN. Discover insights into Tamil philosophy, mathematics, and the intersection of traditional wisdom with modern thought." />
        <meta name="keywords" content="VALIPOKKANN, articles, Tamil philosophy, mathematics, cultural heritage, art theory, philosophy, decolonizing knowledge, Indian mathematics" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Articles | VALIPOKKANN" />
        <meta property="og:description" content="Explore articles on art, philosophy, and cultural heritage by VALIPOKKANN. Discover insights into Tamil philosophy, mathematics, and the intersection of traditional wisdom with modern thought." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://valipokkann.com/articles" />
        <meta property="og:image" content="/valipokkann_transparent_logo.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Articles | VALIPOKKANN" />
        <meta name="twitter:description" content="Explore articles on art, philosophy, and cultural heritage by VALIPOKKANN. Discover insights into Tamil philosophy, mathematics, and the intersection of traditional wisdom with modern thought." />
        <meta name="twitter:image" content="/valipokkann_transparent_logo.png" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://valipokkann.com/articles" />
      </Helmet>

      <StructuredData type="website" data={articlesPageData} />

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif mb-8 text-white">Articles</h1>

          {/* Tag Filter */}
          <div className="mb-8">
            <div className="relative">
              <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                <div className="flex flex-nowrap gap-2 min-w-min">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-4 py-2 rounded-full transition-colors duration-200 whitespace-nowrap ${
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
                      className={`px-4 py-2 rounded-full transition-colors duration-200 whitespace-nowrap ${
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
              {/* Gradient fade effect for scroll indication */}
              <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-neutral-950 dark:from-neutral-900 to-transparent pointer-events-none"></div>
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
                  <div className="flex flex-wrap gap-2">
                    {article.meta.tags?.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-neutral-900 dark:bg-neutral-800 rounded-full text-sm text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
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
                <div className="sticky top-0 bg-neutral-950 dark:bg-neutral-900 p-6 border-b border-neutral-800 rounded-t-lg z-10">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setSelectedArticle(null)}
                  >
                    ✕
                  </button>
                  <h2 className="text-3xl font-serif mb-4 text-white pr-8">{selectedArticle.meta.title}</h2>
                  <div className="flex items-center space-x-4 mb-2">
                    <time className="text-gray-400">{selectedArticle.meta.date}</time>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.meta.tags?.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-neutral-900 dark:bg-neutral-800 rounded-full text-sm text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(100vh-16rem)]">
                  {/* Cover Image */}
                  {selectedArticle.meta.coverImage && (
                    <div className="mb-8 -mx-6 -mt-6">
                      <img
                        src={selectedArticle.meta.coverImage}
                        alt={`Cover image for ${selectedArticle.meta.title}`}
                        className="w-full h-[300px] md:h-[400px] object-cover"
                        onError={(e) => {
                          console.error('Error loading image:', selectedArticle.meta.coverImage);
                          console.error('Image element:', e.currentTarget);
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', selectedArticle.meta.coverImage);
                        }}
                      />
                    </div>
                  )}
                  <article 
                    className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-headings:text-white prose-p:text-gray-300 prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary-dark prose-strong:text-white prose-code:text-green-400 prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral-800 prose-pre:text-gray-200 prose-blockquote:border-l-primary prose-blockquote:text-gray-400 prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 max-w-none"
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
    </>
  );
};

export default Articles; 