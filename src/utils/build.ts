import generateSitemap from './generate-sitemap.js';
import generateStructuredData from './generate-structured-data.js';
import generateSitemapIndex from './generate-sitemap-index.js';
import { generateThirukkuralQuotes } from './generate-quotes.js';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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

    // Run the Thirukkural data splitter
    console.log('Splitting Thirukkural data...');
    execSync('ts-node src/utils/splitThirukkural.ts', { stdio: 'inherit' });

    // Copy the data directory to the dist folder
    const dataDir = path.join(process.cwd(), 'public', 'data');
    const distDataDir = path.join(process.cwd(), 'dist', 'data');

    if (!fs.existsSync(distDataDir)) {
      fs.mkdirSync(distDataDir, { recursive: true });
    }

    // Copy the data directory recursively
    function copyDir(src: string, dest: string) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      const entries = fs.readdirSync(src, { withFileTypes: true });

      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    copyDir(dataDir, distDataDir);
    console.log('Data directory copied to dist folder');
  } catch (error) {
    console.error('Error during build:', error);
    process.exit(1);
  }
};

build(); 