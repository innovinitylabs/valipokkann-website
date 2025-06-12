import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import StructuredData from '../components/StructuredData';
import { Article, ArticleMeta, parseFrontmatter } from '../utils/frontmatter';

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const navigate = useNavigate();

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

  // Prepare structured data for the articles list page
  const articlesPageData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Articles | Vali Pokkan',
    description: 'Explore articles on technology, philosophy, and creative insights by Vali Pokkan.',
    url: 'https://valipokkan.in/articles',
    author: {
      '@type': 'Person',
      name: 'Vali Pokkan',
      url: 'https://valipokkan.in'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vali Pokkan',
      logo: {
        '@type': 'ImageObject',
        url: 'https://valipokkan.in/logo.png'
      }
    },
    blogPost: articles.map(article => ({
      '@type': 'BlogPosting',
      headline: article.meta.title,
      description: article.meta.description,
      datePublished: article.meta.date,
      author: {
        '@type': 'Person',
        name: article.meta.author || 'Vali Pokkan'
      },
      keywords: article.meta.keywords,
      articleSection: article.meta.tags?.[0],
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://valipokkan.in/articles/${article.slug}`
      },
      image: article.meta.coverImage ? `https://valipokkan.in${article.meta.coverImage}` : undefined
    }))
  };

  return (
    <>
      <Helmet>
        <title>Articles | Vali Pokkan</title>
        <meta name="description" content="Explore articles on technology, philosophy, and creative insights by Vali Pokkan. Discover in-depth analysis, tutorials, and thought-provoking content." />
        <meta name="keywords" content="articles, blog, technology, philosophy, creative writing, Vali Pokkan" />
        <meta name="author" content="Vali Pokkan" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Articles | Vali Pokkan" />
        <meta property="og:description" content="Explore articles on technology, philosophy, and creative insights by Vali Pokkan. Discover in-depth analysis, tutorials, and thought-provoking content." />
        <meta property="og:url" content="https://valipokkan.in/articles" />
        <meta property="og:site_name" content="Vali Pokkan" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Articles | Vali Pokkan" />
        <meta name="twitter:description" content="Explore articles on technology, philosophy, and creative insights by Vali Pokkan. Discover in-depth analysis, tutorials, and thought-provoking content." />
        <meta name="twitter:site" content="@valipokkan" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://valipokkan.in/articles" />
      </Helmet>

      <StructuredData type="website" data={articlesPageData} />

      <div className="min-h-[calc(100vh-4rem)] py-12 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif mb-8 text-white">Articles</h1>

          {/* Tag Filter */}
          <div className="mb-8">
            <div className="relative">
              <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-none">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    selectedTag === null
                      ? 'bg-primary text-white'
                      : 'bg-neutral-900 text-gray-300 hover:bg-neutral-800'
                  }`}
                >
                  All
                </button>
                {Array.from(new Set(articles.flatMap(article => article.meta.tags || []))).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                      selectedTag === tag
                        ? 'bg-primary text-white'
                        : 'bg-neutral-900 text-gray-300 hover:bg-neutral-800'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
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
                onClick={() => navigate(`/articles/${article.slug}`)}
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
        </div>
      </div>
    </>
  );
};

export default Articles; 