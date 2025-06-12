import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import { Helmet } from 'react-helmet-async';
import type { Article, ArticleMeta } from '../utils/frontmatter';
import { parseFrontmatter } from '../utils/frontmatter';

const ArticleView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        // Use import.meta.glob to dynamically import the article
        const modules = import.meta.glob<string>('../data/articles/*.md', { 
          query: '?raw',
          import: 'default'
        });
        
        // Find the matching article file
        const articlePath = `../data/articles/${slug}.md`;
        const module = modules[articlePath];
        
        if (!module) {
          throw new Error('Article not found');
        }

        const content = await module();
        const { meta, content: markdownContent } = parseFrontmatter(content);
        setArticle({
          slug: slug!,
          meta,
          content: markdownContent
        });
      } catch (err) {
        console.error('Error loading article:', err);
        setError('Article not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black">
        <div className="text-white text-xl font-serif">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-6 text-white">Article Not Found</h1>
          <p className="text-gray-400 mb-8">The article you're looking for doesn't exist or has been moved.</p>
          <button
            onClick={() => navigate('/articles')}
            className="text-primary hover:text-primary-dark font-medium transition-colors duration-200"
          >
            ← Back to Articles
          </button>
        </div>
      </div>
    );
  }

  // Prepare structured data for the article
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.meta.title,
    description: article.meta.description,
    image: article.meta.coverImage,
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
    }
  };

  return (
    <>
      <Helmet>
        <title>{article.meta.title} | Vali Pokkan</title>
        <meta name="description" content={article.meta.description} />
        <meta name="keywords" content={article.meta.keywords} />
        <meta name="author" content={article.meta.author || 'Vali Pokkan'} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.meta.title} />
        <meta property="og:description" content={article.meta.description} />
        {article.meta.coverImage && (
          <meta property="og:image" content={`https://valipokkan.in${article.meta.coverImage}`} />
        )}
        <meta property="og:url" content={`https://valipokkan.in/articles/${article.slug}`} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.meta.title} />
        <meta name="twitter:description" content={article.meta.description} />
        {article.meta.coverImage && (
          <meta name="twitter:image" content={`https://valipokkan.in${article.meta.coverImage}`} />
        )}
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify(articleStructuredData)}
      </script>

      <div className="min-h-[calc(100vh-4rem)] py-12 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/articles')}
            className="text-primary hover:text-primary-dark mb-8 inline-flex items-center transition-colors duration-200"
          >
            ← Back to Articles
          </button>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-950 dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-neutral-800">
              <h1 className="text-3xl font-serif mb-4 text-white">{article.meta.title}</h1>
              <div className="flex items-center space-x-4 mb-2">
                <time className="text-gray-400">{article.meta.date}</time>
                <div className="flex flex-wrap gap-2">
                  {article.meta.tags?.map((tag: string) => (
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

            {/* Cover Image */}
            {article.meta.coverImage && (
              <div className="w-full">
                <img
                  src={article.meta.coverImage}
                  alt={`Cover image for ${article.meta.title}`}
                  className="w-full h-[300px] md:h-[400px] object-cover"
                  onError={(e) => {
                    console.error('Error loading image:', article.meta.coverImage);
                    console.error('Image element:', e.currentTarget);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', article.meta.coverImage);
                  }}
                />
              </div>
            )}

            <div className="p-6">
              <article 
                className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-headings:text-white prose-p:text-gray-300 prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary-dark prose-strong:text-white prose-code:text-green-400 prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral-800 prose-pre:text-gray-200 prose-blockquote:border-l-primary prose-blockquote:text-gray-400 prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: marked(article.content, {
                    breaks: true,
                    gfm: true
                  }) 
                }} 
              />
            </div>
          </motion.article>
        </div>
      </div>
    </>
  );
};

export default ArticleView; 