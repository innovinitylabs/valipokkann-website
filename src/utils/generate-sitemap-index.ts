import fs from 'fs';
import siteConfig from '../config/site-config';

const generateSitemapIndex = async (): Promise<void> => {
  const baseUrl = `https://${siteConfig.domain}`;
  const currentDate = new Date().toISOString();

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/structured-data-artwork.json</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/structured-data-photography.json</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

  fs.writeFileSync('public/sitemap-index.xml', sitemapIndex);
};

export default generateSitemapIndex; 