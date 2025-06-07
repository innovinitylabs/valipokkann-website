import generateSitemap from './generate-sitemap';
import generateStructuredData from './generate-structured-data';
import generateSitemapIndex from './generate-sitemap-index';

const build = async () => {
  try {
    console.log('Generating sitemap...');
    await generateSitemap();
    console.log('Sitemap generated successfully!');

    console.log('Generating structured data...');
    await generateStructuredData();
    console.log('Structured data generated successfully!');

    console.log('Generating sitemap index...');
    await generateSitemapIndex();
    console.log('Sitemap index generated successfully!');
  } catch (error) {
    console.error('Error during build:', error);
    process.exit(1);
  }
};

build(); 