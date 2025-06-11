import { generateSitemap } from './generate-sitemap.js';
import generateStructuredData from './generate-structured-data.js';
import generateSitemapIndex from './generate-sitemap-index.js';
import { generateThirukkuralQuotes } from './generate-quotes.js';

const build = async () => {
  try {
    console.log('Generating sitemap...');
    await generateSitemap();
    console.log('Sitemap generated successfully!');

    console.log('Generating structured data...');
    await generateStructuredData();
    console.log('Structured data generated successfully!');

    console.log('Generating Thirukkural quotes...');
    await generateThirukkuralQuotes();
    console.log('Thirukkural quotes generated successfully!');

    console.log('Generating sitemap index...');
    await generateSitemapIndex();
    console.log('Sitemap index generated successfully!');
  } catch (error) {
    console.error('Error during build:', error);
    process.exit(1);
  }
};

build(); 