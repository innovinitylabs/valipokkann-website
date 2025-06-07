import fs from 'fs';
import path from 'path';
import siteConfig from '../config/site-config.js';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const generateSitemap = async (): Promise<void> => {
  const { glob } = await import('glob');
  const baseUrl = `https://${siteConfig.domain}`;
  const urls: SitemapUrl[] = [];

  // Add main pages
  urls.push({
    loc: baseUrl,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 1.0
  });

  // Add navigation pages
  siteConfig.navigation.forEach(nav => {
    urls.push({
      loc: `${baseUrl}${nav.path}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    });
  });

  // Add artwork pages
  const artworkFiles = await glob.sync('src/data/artwork/*.md');
  artworkFiles.forEach((file: string) => {
    const slug = path.basename(file, '.md');
    urls.push({
      loc: `${baseUrl}/art/${slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    });
  });

  // Add photography pages
  const photoFiles = await glob.sync('src/data/photography/*.md');
  photoFiles.forEach((file: string) => {
    const slug = path.basename(file, '.md');
    urls.push({
      loc: `${baseUrl}/photography/${slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    });
  });

  // Add article pages
  const articleFiles = await glob.sync('src/data/articles/*.md');
  articleFiles.forEach((file: string) => {
    const slug = path.basename(file, '.md');
    urls.push({
      loc: `${baseUrl}/articles/${slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    });
  });

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('')}
</urlset>`;

  // Write sitemap to public directory
  fs.writeFileSync('public/sitemap.xml', sitemap);
};

export default generateSitemap; 